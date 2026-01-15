import { db } from "@/drizzle/db"
import { CourseSectionTable, CourseTable, LessonTable, UserCourseAccessTable, type CourseInsert } from "@/drizzle/schema"
import { CourseAuthorsTable } from "@/drizzle/schema/courseAuthors";
import { wherePublicCourseSections, wherePublicLessons } from "@/helpers/query";
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq, countDistinct, asc,or } from "drizzle-orm";
import { Hono } from 'hono';
import { z } from 'zod';
import { jsonValidation } from "@/helpers/validation";

const coursesRoute = new Hono();
const insertSchema = z.object({
  name: z.string(),
  description: z.string(),
  author_ids: z.array(z.string())
})
coursesRoute.post('/', jsonValidation(insertSchema), async (c)=>{
  const body = c.req.valid('json');
  const {author_ids} = body;
  try{
    const result = await db.transaction(async (tx)=>{
      const [newCourse] = await db.insert(CourseTable).values(body).returning();
      if (!newCourse) throw new Error('Failed to create course');

      await tx.insert(CourseAuthorsTable).values(author_ids.map((author_id, index)=>({
        course_id: newCourse.id,
        author_id,
        is_primary: index === 0,
      })));
      return newCourse;
    })
    return c.json(standardResponse(result,201));

  }catch (error) {
    console.error("Error creating course:", error);
    return c.json(errorResponse("Failed to create course" ));
  }
 
});


coursesRoute.get('all/:userId', async (c)=> {

  const {userId} = c.req.param();
  const result = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
      status: CourseTable.status,
    })
    .from(CourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.course_id, CourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.section_id, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.course_id, CourseTable.id)
    )
    .leftJoin(
      CourseAuthorsTable,
      eq(CourseAuthorsTable.course_id, CourseTable.id)
    )
    .where(eq(CourseAuthorsTable.author_id, userId))
    .orderBy(asc(CourseTable.name))
    .groupBy(CourseTable.id);

    return c.json(standardResponse(result))

});

coursesRoute.get('/:id', async (c)=> {
  const {id} = c.req.param();
  const queries = await c.req.query();
  const publicOnly = queries['publicOnly'] == 'true';
  const course = await db.query.CourseTable.findFirst({
    where:eq(CourseTable.id, id),
    with:{
      courseSections:{
        orderBy:asc(CourseSectionTable.order),
        where: publicOnly ? wherePublicCourseSections : undefined,
        with:{
          lessons:{
            orderBy: asc(LessonTable.order),
            where: publicOnly ? wherePublicLessons : undefined,
          }
        }
      }
    }
  })
  return c.json(standardResponse(course))
});

coursesRoute.put('/:id', async (c)=> {
  const {id} = c.req.param();
  const body = await c.req.json();
  const [updatedCourse] = await db.update(CourseTable).set(body).where(eq(CourseTable.id, id)).returning();
  if (!updatedCourse) return c.json(errorResponse('Failed to update course'))
  return c.json(standardResponse(updatedCourse))
});

coursesRoute.delete('/:id', async (c)=> {
  const id = c.req.param('id');
  const result = await db.query.UserCourseAccessTable.findMany({
    where: eq(UserCourseAccessTable.course_id, id),
    with:{
      course: true,
    }
  });
  let status='Archived';
  if(result.length === 0){
      const [deletedCourse] = await db
        .delete(CourseTable)
        .where(eq(CourseTable.id, id))
        .returning()

      if (!deletedCourse) return c.json(errorResponse('Failed to delete course'));
      status = 'Deleted Permanently';
  }else{
    const [updatedCourse] = await db.update(CourseTable).set({status:'private'}).where(eq(CourseTable.id, id)).returning();
    if (!updatedCourse) return c.json(errorResponse('Failed to archive course'));
  }

  return c.json(standardResponse('The course has been '+result));
});

export default coursesRoute;