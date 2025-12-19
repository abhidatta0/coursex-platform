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

export default lessonRoute;