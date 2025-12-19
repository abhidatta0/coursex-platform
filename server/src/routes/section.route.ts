import { db } from "@/drizzle/db"
import { CourseSectionTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq } from "drizzle-orm";
import { Hono } from 'hono';

const sectionRoute = new Hono();

sectionRoute.post('/',async (c)=>{
  const body = await c.req.json();
  const order = await getNextSectionOrder(body.course_id);
  const [newSection] = await db.insert(CourseSectionTable).values({...body, order}).returning();
  if (!newSection) return c.json(errorResponse('Failed to create section'))
  return c.json(standardResponse(newSection, 201))
});

sectionRoute.put('/ordering',async (c)=>{
  const {sectionIds} = await c.req.json<{sectionIds: string[]}>();

  const sections = await Promise.all(sectionIds.map((id, index)=> db.update(CourseSectionTable).set({order: index}).where(eq(CourseSectionTable.id, id))
  .returning()))

  return c.json(standardResponse("Section order updated successfully"))
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

sectionRoute.put('/:id', async (c)=>{ 
  const {id} = c.req.param();
  const data = await c.req.json();

  const [updatedSection] = await db
    .update(CourseSectionTable)
    .set(data)
    .where(eq(CourseSectionTable.id, id))
    .returning()
  if (updatedSection == null) {
    return c.json(errorResponse("Failed to update section"));
  }
  return c.json(standardResponse(updatedSection));

})

sectionRoute.delete('/:id', async (c)=>{ 
  const {id} = c.req.param();

  const [deletedSection] = await db
    .delete(CourseSectionTable)
    .where(eq(CourseSectionTable.id, id))
    .returning();
  if (deletedSection == null) {
    return c.json(errorResponse("Failed to delete section"));
  }
  return c.json(standardResponse(deletedSection));
})
export default sectionRoute;