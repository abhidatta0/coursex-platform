import { db } from "@/drizzle/db";
import { Hono } from "hono";
import {and, eq, getTableColumns, inArray, isNull} from 'drizzle-orm';
import { ProductAuthorsTable, ProductTable, PurchaseTable, UserCourseAccessTable } from "@/drizzle/schema";
import { errorResponse, standardResponse } from "@/helpers/responseHelper";

const purchaseRoute= new Hono();

purchaseRoute.post('refund/:id', async (c)=>{
    const {id} = c.req.param()
    await db.transaction(async trx=>{
        const [updatedPurchase] = await trx.update(PurchaseTable).set({refunded_at: new Date()}).where(eq(PurchaseTable.id, id)).returning();
        if(!updatedPurchase){
            trx.rollback();
            return c.json(errorResponse('No purchase details found'));
        }
        if(updatedPurchase.product_id && updatedPurchase.user_id){
          await revokeUserCourseAccess({productId: updatedPurchase.product_id, userId: updatedPurchase.user_id}, trx);
        }
    })
    return c.json(standardResponse('Refund successful'));

})

const revokeUserCourseAccess= async ({
    userId,
    productId,
  }: {
    userId: string
    productId: string,
  },
  trx: Omit<typeof db, "$client"> = db
)=>{
    const validPurchases = await trx.query.PurchaseTable.findMany({
        where: and(eq(PurchaseTable.user_id,userId),isNull(PurchaseTable.refunded_at)),
        with:{
            product:{
                with:{courseProducts:{columns:{course_id: true}}}
            }
        }
    });


    const refundPurchase = await trx.query.ProductTable.findFirst({
        where: eq(ProductTable.id, productId),
        with:{courseProducts:{columns:{course_id: true}}}
    });

    if(!refundPurchase) return ;
    const validCourseIds = validPurchases.flatMap(p=> p.product && p.product.courseProducts.map(cp=> cp.course_id));

    const removeCourseIds = refundPurchase.courseProducts.flatMap(cp=> cp.course_id).filter(courseId=> !validCourseIds.includes(courseId));


    const revokedAccesses = await trx.delete(UserCourseAccessTable).where(and(eq(UserCourseAccessTable.user_id, userId),inArray(UserCourseAccessTable.course_id, removeCourseIds)))
    .returning();

    return revokedAccesses;

}

purchaseRoute.get('sales/:authorId', async (c)=>{

    const {authorId} = c.req.param();
   
    const result = await db.select({
           ...getTableColumns(PurchaseTable),
        }).from(PurchaseTable)
        .leftJoin(ProductTable, eq(PurchaseTable.product_id, ProductTable.id))
        .leftJoin(
          ProductAuthorsTable,
          eq(ProductAuthorsTable.product_id, ProductTable.id)
        )
        .where(eq(ProductAuthorsTable.author_id, authorId))
        .groupBy(PurchaseTable.id);
    return c.json(standardResponse(result))
})


export default purchaseRoute;