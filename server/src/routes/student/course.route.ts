import { standardResponse } from '@/helpers/responseHelper';
import {Hono} from 'hono';
import { CourseTable, CourseSectionTable, LessonTable , 
    UserLessonCompleteTable, UserCourseAccessTable} from "@/drizzle/schema";
import {countDistinct, and ,eq, or} from 'drizzle-orm';
import { db } from '@/drizzle/db';

const studentCourseRoute = new Hono();


studentCourseRoute.get('all/:userId', async (c)=>{
    const {userId} = c.req.param();
    const courses = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionsCount: countDistinct(CourseSectionTable.id),
      lessonsCount: countDistinct(LessonTable.id),
      lessonsComplete: countDistinct(UserLessonCompleteTable.lesson_id),
    })
    .from(CourseTable)
    .leftJoin(
      UserCourseAccessTable,
      and(
        eq(UserCourseAccessTable.course_id, CourseTable.id),
        eq(UserCourseAccessTable.user_id, userId)
      )
    )
    .leftJoin(
      CourseSectionTable,
      and(
        eq(CourseSectionTable.course_id, CourseTable.id),
        eq(CourseSectionTable.status, "public")
      )
    )
    .leftJoin(
      LessonTable,
      and(eq(LessonTable.section_id, CourseSectionTable.id), or(
      eq(LessonTable.status, "public"),
      eq(LessonTable.status, "preview")
    ))
    )
    .leftJoin(
      UserLessonCompleteTable,
      and(
        eq(UserLessonCompleteTable.lesson_id, LessonTable.id),
        eq(UserLessonCompleteTable.user_id, userId)
      )
    )
    .orderBy(CourseTable.name)
    .groupBy(CourseTable.id);

    return c.json(standardResponse(courses))
});


export default studentCourseRoute;