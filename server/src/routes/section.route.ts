import { db } from "@/drizzle/db"
import { CourseSectionTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { Hono } from 'hono';

const sectionRoute = new Hono();

sectionRoute.post('/',async (c)=>{
  const body = await c.req.json();
  const order = await getNextSectionOrder(body.course_id);
  const [newSection] = await db.insert(CourseSectionTable).values({...body, order}).returning();
  if (!newSection) return c.json(errorResponse('Failed to create section'))
  return c.json(standardResponse(newSection, 201))
});

const getNextSectionOrder = async (courseId: string)=>{
  const section = await db.query.CourseSectionTable.findFirst({
    columns:{
      order: true,
    },
    where:({course_id,},{eq})=> eq(course_id, courseId),
    orderBy: ({order},{desc})=> desc(order), 
  });

  return section ? section.order +1: 0;
}

export default sectionRoute;