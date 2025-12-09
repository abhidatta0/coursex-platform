import { Hono } from 'hono';
import { db } from '../drizzle/db';
import { UserTable } from '../drizzle/schema';
import { verifyWebhook } from '@clerk/backend/webhooks'

import { eq } from 'drizzle-orm';

const usersWebhook = new Hono();

console.log({wh:process.env.CLERK_WEBHOOK_SIGNING_SECRET})
usersWebhook.get("/", (c)=>{
    console.log("here")
    return c.json({"mes":"122"});
})

usersWebhook.post('/', async (c) => {
   console.log("post")
  
  try {
    const evt = await verifyWebhook(c.req.raw,{
        signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET
    })

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return c.json({status: 'success'})
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return c.json({error: 'Verification failed'},400);
  }
})

usersWebhook.get('/',async (c)=>{

    return c.json({"message":"Hello users"})
});

usersWebhook.post('/',async (c)=>{
    const body = await c.req.json();
    const [newUser]  = await db.insert(UserTable).values(body).returning().onConflictDoUpdate({
        target:[UserTable.clerk_user_id],
        set: body,
    });

    if(!newUser){
        throw new Error('Failed to create user');
    }

    return c.json(newUser);
})

usersWebhook.put('/:clerkUserId',async (c)=>{
    const body = await c.req.json();
    const {clerkUserId} = c.req.param()
    const [updatedUser]  = await db.update(UserTable).set(body).where(eq(UserTable.clerk_user_id, clerkUserId)).returning();

    if(!updatedUser){
        throw new Error('Failed to update user');
    }

    return c.json(updatedUser);
})


usersWebhook.delete('/:clerkUserId',async (c)=>{
    const {clerkUserId} = c.req.param()
    const [deletedUser]  = await db.delete(UserTable).where(eq(UserTable.clerk_user_id, clerkUserId)).returning();

    if(!deletedUser){
        throw new Error('Failed to delete user');
    }

    return c.json(deletedUser);
})

export default usersWebhook;