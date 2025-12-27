import { db } from "@/drizzle/db"
import { PurchaseTable } from "@/drizzle/schema";
import { standardResponse } from "@/helpers/responseHelper";
import { eq , desc} from "drizzle-orm";
import { Hono } from 'hono';

const purchaseRoute = new Hono();

purchaseRoute.get('/:userId', async (c)=>{
    const {userId} = c.req.param();
    const purchases = await db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      price_paid_in_cents: true,
      refunded_at: true,
      product_id: true,
      created_at: true,
    },
    where: eq(PurchaseTable.user_id, userId),
    orderBy: desc(PurchaseTable.created_at),
  });

  return c.json(standardResponse(purchases));
})

export default purchaseRoute;