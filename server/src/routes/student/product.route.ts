import { db } from "@/drizzle/db"
import { PurchaseTable } from "@/drizzle/schema"
import { standardResponse } from "@/helpers/responseHelper";
import { and, eq, isNull } from "drizzle-orm"
import { Hono } from "hono"


const studentProductRoute = new Hono();

studentProductRoute.post('isProductOwned',async (c)=>{
  const {userId, productId} = await c.req.json();
  const existingPurchase = await db.query.PurchaseTable.findFirst({
    where: and(
      eq(PurchaseTable.product_id, productId),
      eq(PurchaseTable.user_id, userId),
      isNull(PurchaseTable.refunded_at)
    ),
  })

  return c.json(standardResponse(existingPurchase != null))

});
export default studentProductRoute;