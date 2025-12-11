import { db } from "@/drizzle/db"
import { CourseTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
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


export default coursesRoute;