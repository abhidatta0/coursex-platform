import { db } from "@/drizzle/db"
import { CourseProductTable, ProductTable, PurchaseTable, type ProductInsert, type ProductUpdate } from "@/drizzle/schema"
import { errorResponse, standardResponse } from "@/helpers/responseHelper";
import { eq, countDistinct, asc, getTableColumns } from "drizzle-orm";
import { Hono } from 'hono';

const productRoute = new Hono();

productRoute.post('/', async (c)=>{
  const data = await c.req.json<ProductInsert & {course_ids:string[]}>();
  const newProduct = await db.transaction(async trx =>{
    const [newProduct] = await trx.insert(ProductTable).values(data).returning();
    if(!newProduct){
      trx.rollback();
      return c.json(errorResponse('Failed to create product'));
    }

    await trx.insert(CourseProductTable).values(data.course_ids.map((cId)=> ({course_id: cId, product_id:newProduct.id})));
    return newProduct;
  });
  return c.json(standardResponse(newProduct))
});


productRoute.put('/:id', async (c)=>{
  const {id} = c.req.param();
  const data = await c.req.json<ProductUpdate & {course_ids:string[]}>();
  const updateProduct = await db.transaction(async trx =>{
    const [updateProduct] = await trx.update(ProductTable).set(data).where(eq(ProductTable.id,id)).returning();
    if(!updateProduct){
      trx.rollback();
      return c.json(errorResponse('Failed to update product'));
    }

    await trx.delete(CourseProductTable).where(eq(CourseProductTable.product_id, updateProduct.id));
    await trx.insert(CourseProductTable).values(data.course_ids.map((cId)=> ({course_id: cId, product_id:updateProduct.id})));
    return updateProduct;
  });
  return c.json(standardResponse(updateProduct))
});
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