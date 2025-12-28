import { errorResponse, standardResponse } from '@/helpers/responseHelper';
import {Hono} from 'hono';
import { CourseTable, CourseSectionTable, LessonTable , 
    UserLessonCompleteTable, UserCourseAccessTable} from "@/drizzle/schema";
import {countDistinct, and ,eq, or, asc} from 'drizzle-orm';
import { db } from '@/drizzle/db';

const studentCourseRoute = new Hono();

export const wherePublicCourseSections = eq(CourseSectionTable.status, "public");
export const wherePublicLessons = or(
  eq(LessonTable.status, "public"),
  eq(LessonTable.status, "preview")
)
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

studentCourseRoute.get(':courseId', async (c)=>{
  const {courseId} = c.req.param();

  const course = await db.query.CourseTable.findFirst({
    where: eq(CourseTable.id, courseId),
    with:{
      courseSections:{
        orderBy: asc(CourseSectionTable.order),
        where: wherePublicCourseSections,
        with:{
          lessons:{
            orderBy: asc(LessonTable.order),
            where: wherePublicLessons,
          }
        }
      }
    }
  });

  if(!course){
    return c.json(errorResponse('No course found with this id'));
  }
  return c.json(standardResponse(course));
});


export default studentCourseRoute;