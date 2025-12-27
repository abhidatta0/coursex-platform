import { db } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { errorResponse, standardResponse } from '@/helpers/responseHelper';
import {Hono} from 'hono';

const orderRoute = new Hono();

// dummy order creation 
orderRoute.post('/create',async (c)=>{
  try {
    const body = await c.req.json();
    console.log({body})

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

export default orderRoute;

