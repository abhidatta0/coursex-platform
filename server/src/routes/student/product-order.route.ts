import { db } from '@/drizzle/db';
import { PurchaseTable, UserCourseAccessTable } from '@/drizzle/schema';
import { errorResponse, standardResponse } from '@/helpers/responseHelper';
import { eq } from 'drizzle-orm';
import {Hono} from 'hono';

const orderRoute = new Hono();

// dummy order creation 
orderRoute.post('/create',async (c)=>{
  try {
    const body = await c.req.json();

    const random = Math.floor(Math.random()*(3)+1);  // between 1 and 3
    const isSuccess = await new Promise((res) => setTimeout(() => res(true), random * 1000));
    if(isSuccess){
      const [newlyCreatedOrder] = await db.insert(PurchaseTable).values(body).returning();
      if(!newlyCreatedOrder){
        return c.json(errorResponse("Failed to create order"))      
      }
      return c.json(standardResponse({orderId: newlyCreatedOrder.id}))        
    }
  }catch(e){
    console.error(e);
    return c.json(errorResponse("Failed to create order"))      
  }
});

orderRoute.post('/capture',async (c)=>{
  const {paymentId, orderId} = await c.req.json();
  try {
    await db.transaction(async (tx) => {
      const purchase = await tx.query.PurchaseTable.findFirst({where:eq(PurchaseTable.id, orderId)});

      console.log("in capturePaymentAndFinalizeOrder")

      if (!purchase) {
        return c.json(errorResponse("Purchase can not be found"));
      }

      purchase.payment_status = "paid";
      purchase.order_status = "confirmed";
      purchase.payment_id = paymentId;

      await tx.update(PurchaseTable).set(purchase).where(eq(PurchaseTable.id, orderId));

      const product= await tx.query.ProductTable.findFirst({where:eq(PurchaseTable.id, purchase.product_id),with:{
        courseProducts: true
      }});
      if(!product){
        return c.json(errorResponse("Related product can not be found"));
      }
      await addUserCourseAccess({userId: purchase.user_id, courseIds:product.courseProducts.map(cp=> cp.course_id)},tx);
    })
    return c.json(standardResponse("success"));
  }catch(e){
    console.error(e);
    const purchase = await db.query.PurchaseTable.findFirst({where:eq(PurchaseTable.id, orderId)});
    if (!purchase) {
      return c.json(errorResponse("Purchase can not be found"));
    }

    purchase.payment_status = "failed";
    purchase.order_status = "failed";
    purchase.payment_id = paymentId;

    await db.update(PurchaseTable).set(purchase).where(eq(PurchaseTable.id, orderId));
    return c.json(errorResponse("Some error occured!",500));
  }
});

export async function addUserCourseAccess(
  {
    userId,
    courseIds,
  }: {
    userId: string
    courseIds: string[]
  },
  trx: Omit<typeof db, "$client"> = db
) {
  const accesses = await trx
    .insert(UserCourseAccessTable)
    .values(courseIds.map(courseId => ({ user_id: userId, course_id:courseId })))
    .onConflictDoNothing()
    .returning()

  return accesses
}


export default orderRoute;

