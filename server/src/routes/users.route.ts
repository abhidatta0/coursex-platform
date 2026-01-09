import { db } from '@/drizzle/db';
import { CourseTable, ProductTable, UserTable, UserCourseAccessTable, LessonTable, CourseSectionTable, CourseAuthorsTable, ProductAuthorsTable } from '@/drizzle/schema';
import { standardResponse } from '@/helpers/responseHelper';
import { inArray , count,countDistinct, eq} from 'drizzle-orm';
import { Hono } from 'hono';

const usersRoute = new Hono();

usersRoute.get('/',async (c)=>{

    return c.json({"message":"Hello users"})
});

usersRoute.post('batchUserInfo', async (c)=>{
    const {userIds} = await c.req.json();

    const userInfos = await db.query.UserTable.findMany({
        where: inArray(UserTable.id, userIds),
        columns:{name: true, id: true}
    });


    return c.json(standardResponse(userInfos));
});

usersRoute.get('/stats/:userId',async (c)=>{
    const {userId} = c.req.param(); 
    const [data] = await db.select({totalCourses: countDistinct(CourseTable), totalStudents: countDistinct(UserTable),
        totalCourseSections: count(CourseSectionTable),
        totalLessons: count(LessonTable)
    }).from(CourseAuthorsTable)
    .leftJoin(CourseTable, eq(CourseTable.id, CourseAuthorsTable.course_id))
    .leftJoin(UserCourseAccessTable, eq(UserCourseAccessTable.course_id, CourseTable.id))
    .leftJoin(UserTable, eq(UserTable.id, UserCourseAccessTable.user_id))
    .leftJoin(CourseSectionTable, eq(CourseSectionTable.course_id,CourseTable.id))
    .leftJoin(LessonTable, eq(LessonTable.section_id,CourseSectionTable.id))
    .where(eq(CourseAuthorsTable.author_id, userId))
    .groupBy(CourseAuthorsTable.author_id);

    const [productData] = await db.select({totalProducts: countDistinct(ProductTable)}).from(ProductAuthorsTable)
    .leftJoin(ProductTable, eq(ProductTable.id, ProductAuthorsTable.product_id))
    .where(eq(ProductAuthorsTable.author_id, userId))
    .groupBy(ProductAuthorsTable.author_id);

    const result = {
        ...data,
        ...(productData || {totalProducts:0}),
    }

    return c.json(standardResponse(result));
})


export default usersRoute;