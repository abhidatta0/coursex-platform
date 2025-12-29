import { db } from "@/drizzle/db"
import { CourseSectionTable, CourseTable, LessonTable, UserCourseAccessTable, UserLessonCompleteTable } from "@/drizzle/schema"
import { wherePublicCourseSections, wherePublicLessons } from "@/helpers/query";
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { and, eq } from "drizzle-orm";
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
export default lessonRoute;