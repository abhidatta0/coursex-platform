import { db } from "@/drizzle/db"
import { CourseSectionTable, CourseTable, LessonTable, UserCourseAccessTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq, countDistinct, asc } from "drizzle-orm";
import { Hono } from 'hono';

const coursesRoute = new Hono();

coursesRoute.post('/',async (c)=>{
  try{
    const body = await c.req.json();
    const [newCourse] = await db.insert(CourseTable).values(body).returning();
    if (!newCourse) return c.json(errorResponse('Failed to create course'))
    return c.json(standardResponse(newCourse, 201))
  }catch (error) {
    return c.json(errorResponse('Internal server error', 500, error), 500);
  }
});


coursesRoute.get('/', async (c)=> {

  const result = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
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
    .orderBy(asc(CourseTable.name))
    .groupBy(CourseTable.id);

    return c.json(standardResponse(result))

});

coursesRoute.delete('/:id', async (c)=> {
  const id = c.req.param('id');
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, id))
    .returning()

  if (!deletedCourse) return c.json(errorResponse('Failed to delete course'))
  return c.json(standardResponse({}))
});

export default coursesRoute;