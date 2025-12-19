import { db } from "@/drizzle/db"
import { LessonTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq } from "drizzle-orm";
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

})
export default lessonRoute;