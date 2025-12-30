import { db } from "@/drizzle/db"
import { CourseSectionTable, CourseTable, LessonTable, UserCourseAccessTable, UserLessonCompleteTable } from "@/drizzle/schema"
import { wherePublicCourseSections, wherePublicLessons } from "@/helpers/query";
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { and, desc, eq, lt , gt, asc} from "drizzle-orm";
import { Hono } from 'hono';

const lessonRoute = new Hono();

lessonRoute.post('/',async (c)=>{
  const body = await c.req.json();
  const order = await getNextLessonOrder(body.section_id);
  const [newLesson] = await db.insert(LessonTable).values({...body, order}).returning();
  if (!newLesson) return c.json(errorResponse('Failed to create lesson'))
  return c.json(standardResponse(newLesson, 201))
});

lessonRoute.put('/ordering',async (c)=>{
  const {lessonIds} = await c.req.json<{lessonIds: string[]}>();

  await Promise.all(lessonIds.map((id, index)=> db.update(LessonTable).set({order: index}).where(eq(LessonTable.id, id))
  .returning()))

  return c.json(standardResponse("Lesson order updated successfully"))
});

lessonRoute.put("updateLessonComplete", async (c)=>{
  const {userId,lessonId, complete} = await c.req.json<{userId:string, lessonId:string, complete: boolean}>();

  let completion: { lesson_id: string; user_id: string } | undefined
  if (complete) {
    const [c] = await db
      .insert(UserLessonCompleteTable)
      .values({
        lesson_id: lessonId,
        user_id: userId,
      })
      .onConflictDoNothing()
      .returning()
    completion = c;
  } else {
    const [c] = await db
      .delete(UserLessonCompleteTable)
      .where(
        and(
          eq(UserLessonCompleteTable.lesson_id, lessonId),
          eq(UserLessonCompleteTable.user_id, userId)
        )
      )
      .returning();
    completion = c;
  }

  return c.json(standardResponse(completion));
});

lessonRoute.put('/:lessonId',async (c)=>{
  const {lessonId} = c.req.param();
  const body = await c.req.json();

  try{
    const updatedLesson = await db.transaction(async trx=>{
      const currentLesson = await trx.query.LessonTable.findFirst({
        where:eq(LessonTable.id, lessonId),
        columns:{section_id: true},
      });
      if(body.section_id !== null && currentLesson?.section_id !== body.section_id 
        && !body.order){
          body.order = await getNextLessonOrder(body.section_id);
        }

      const [updatedLesson] = await trx.update(LessonTable).set(body).where(eq(LessonTable.id,lessonId)).returning();

      if (updatedLesson == null) {
        trx.rollback()
        throw new Error("Failed to update lesson")
      }
      return updatedLesson;
    })

    return c.json(standardResponse(updatedLesson))

  }catch(e){
    if(e instanceof Error){
    return c.json(errorResponse(e.message))
    }
  }

});



const getNextLessonOrder = async (sectionId: string)=>{
  const lesson = await db.query.LessonTable.findFirst({
    columns:{
      order: true,
    },
    where:({section_id,},{eq})=> eq(section_id, sectionId),
    orderBy: ({order},{desc})=> desc(order), 
  });

  return lesson ? lesson.order +1: 0;
}

lessonRoute.delete('/:id', async (c)=> {
  const {id} = c.req.param();
  const [deletedLesson] = await db
      .delete(LessonTable)
      .where(eq(LessonTable.id, id))
      .returning()
  if (deletedLesson == null) {
    return c.json(errorResponse('Failed to delete lesson'))  
  }
  return c.json(standardResponse(deletedLesson));

});

lessonRoute.get("/completed/:userId", async (c)=>{
  const {userId} = c.req.param();
  const data = await db.query.UserLessonCompleteTable.findMany({
    columns:{lesson_id: true},
    where: eq(UserLessonCompleteTable.user_id, userId),
  })

  return c.json(standardResponse(data.map(d=> d.lesson_id)))
})

lessonRoute.get('prev/:lessonId', async (c)=>{
  const { lessonId } = c.req.param();
  const  currentLesson = await db.query.LessonTable.findFirst({
    where: and(eq(LessonTable.id, lessonId), wherePublicLessons)
  });
  if(!currentLesson){
    return c.json(errorResponse("No lesson found"));
  }

  // First we check for the lesson having order less than current, sorted
  let prevLessonId = await db.query.LessonTable.findFirst({
    where:and(lt(LessonTable.order, currentLesson.order), eq(LessonTable.section_id, currentLesson.section_id),wherePublicLessons),
    orderBy:desc(LessonTable.order),
    columns:{id: true},
  });
  if(!prevLessonId){
    const sectionOfCurrentLesson = await db.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, currentLesson.section_id),
      columns:{order: true, course_id: true},
    });
    
    if(!sectionOfCurrentLesson){
      return c.json(errorResponse("No section found"));
    }

    let prevSection = await db.query.CourseSectionTable.findFirst({
    where:and(lt(CourseSectionTable.order, sectionOfCurrentLesson.order), 
    eq(CourseSectionTable.course_id, sectionOfCurrentLesson.course_id),wherePublicCourseSections),
    orderBy:desc(CourseSectionTable.order),
    columns:{id: true},
    });

    if(!prevSection){
      return c.json(standardResponse(null))
    }

    prevLessonId= await db.query.LessonTable.findFirst({
    where:and(eq(LessonTable.section_id,prevSection.id),wherePublicLessons),
    orderBy:desc(LessonTable.order),
    columns:{id: true},
    });
    
    return c.json(standardResponse(prevLessonId?  prevLessonId.id : null));
    
  }
  else{
    return c.json(standardResponse(prevLessonId.id));
  }
})

lessonRoute.get('next/:lessonId', async (c)=>{
  const { lessonId } = c.req.param();

  const  currentLesson = await db.query.LessonTable.findFirst({
    where: and(eq(LessonTable.id, lessonId), wherePublicLessons)
  });
  if(!currentLesson){
    return c.json(errorResponse("No lesson found"));
  }


  // First we check for the lesson having order greater than current, sorted
  let nextLessonId = await db.query.LessonTable.findFirst({
    where:and(gt(LessonTable.order, currentLesson.order), eq(LessonTable.section_id, currentLesson.section_id),wherePublicLessons),
    orderBy:asc(LessonTable.order),
    columns:{id: true},
  });


  if(!nextLessonId){
    const sectionOfCurrentLesson = await db.query.CourseSectionTable.findFirst({
      where: eq(CourseSectionTable.id, currentLesson.section_id),
      columns:{order: true, course_id: true},
    });
    

    if(!sectionOfCurrentLesson){
      return c.json(errorResponse("No section found"));
    }

    
    let nextSection = await db.query.CourseSectionTable.findFirst({
    where:and(gt(CourseSectionTable.order, sectionOfCurrentLesson.order), 
    eq(CourseSectionTable.course_id, sectionOfCurrentLesson.course_id),wherePublicCourseSections),
    orderBy:asc(CourseSectionTable.order),
    columns:{id: true},
    });



    if(!nextSection){
      return c.json(standardResponse(null))
    }

    nextLessonId= await db.query.LessonTable.findFirst({
    where:and(eq(LessonTable.section_id,nextSection.id),wherePublicLessons),
    orderBy:asc(LessonTable.order),
    columns:{id: true},
    }); 


    return c.json(standardResponse(nextLessonId?  nextLessonId.id : null));


  }
  else{
    return c.json(standardResponse(nextLessonId.id));
  }
})

lessonRoute.get("/:id", async (c)=>{
  const {id} = c.req.param();
  const data = await db.query.LessonTable.findFirst({
    where: and(eq(LessonTable.id, id), wherePublicLessons)
  });

  return c.json(standardResponse(data))
})

lessonRoute.post("checkAccess", async (c)=>{
  const {userId, lessonId} = await c.req.json<{userId:string, lessonId:string}>();
  const lesson = await db.query.LessonTable.findFirst({
    where: and(eq(LessonTable.id, lessonId), wherePublicLessons)
  });

  if(!lesson){
    return c.json(errorResponse("No lesson found"));
  }

  if(lesson.status === 'preview'){
    return  c.json(standardResponse(true));
  }

  const [data] = await db.select({courseId: CourseTable.id}).from(UserCourseAccessTable)
  .leftJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.course_id))
  .leftJoin(CourseSectionTable, and(eq(CourseSectionTable.course_id, CourseTable.id), wherePublicCourseSections))
  .leftJoin(LessonTable, and(eq(LessonTable.section_id, CourseSectionTable.id), wherePublicLessons,eq(LessonTable.id, lesson.id)))
  .where(eq(UserCourseAccessTable.user_id,userId))
  .limit(1);


  return c.json(standardResponse(!!(data && data.courseId)));
})

lessonRoute.get("checkLessonComplete/:userId/:lessonId", async (c)=>{
  const {userId, lessonId} = c.req.param();
  const data = await db.query.UserLessonCompleteTable.findFirst({
    where: and(eq(UserLessonCompleteTable.user_id, userId), eq(UserLessonCompleteTable.lesson_id, lessonId)),
  })

  return c.json(standardResponse(!!data))
})

lessonRoute.get("canUpdateCompletion/:userId/:lessonId", async (c)=>{
  const {userId, lessonId} = c.req.param();
  const [courseAccess] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .innerJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.course_id))
    .innerJoin(
      CourseSectionTable,
      and(
        eq(CourseSectionTable.course_id, CourseTable.id),
        wherePublicCourseSections
      )
    )
    .innerJoin(
      LessonTable,
      and(eq(LessonTable.section_id, CourseSectionTable.id), wherePublicLessons)
    )
    .where(
      and(
        eq(LessonTable.id, lessonId),
        eq(UserCourseAccessTable.user_id, userId)
      )
    )
    .limit(1);
  return c.json(standardResponse(!!courseAccess))
});


export default lessonRoute;