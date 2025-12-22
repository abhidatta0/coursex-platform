import { db } from "@/drizzle/db"
import { CourseProductTable, ProductTable, PurchaseTable } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq, countDistinct, asc, getTableColumns } from "drizzle-orm";
import { Hono } from 'hono';

const productRoute = new Hono();


productRoute.get('/',async (c)=>{
    const result = await db.select({
       ...getTableColumns(ProductTable),
       coursesCount: countDistinct(CourseProductTable.course_id),
       customersCount: countDistinct(PurchaseTable.user_id),
    }).from(ProductTable)
    .leftJoin(PurchaseTable, eq(PurchaseTable.product_id, ProductTable.id))
    .leftJoin(CourseProductTable, eq(CourseProductTable.product_id, ProductTable.id))
    .orderBy(asc(ProductTable.updated_at))
    .groupBy(ProductTable.id);

    return c.json(standardResponse(result));
})

productRoute.delete('/:id', async (c)=> {
  const id = c.req.param('id');
  const [deletedCourse] = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, id))
    .returning();

  if (!deletedCourse) return c.json(errorResponse('Failed to delete product'))
  return c.json(standardResponse({}))
});
export default productRoute;