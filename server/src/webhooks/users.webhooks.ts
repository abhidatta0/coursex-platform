import { Hono } from 'hono';
import { db } from '../drizzle/db';
import { UserTable, type UserInsert } from '../drizzle/schema';
import { verifyWebhook } from '@clerk/backend/webhooks'

import { eq } from 'drizzle-orm';
import { syncClerkUserMetadata } from '../services/clerk';

const usersWebhook = new Hono();

usersWebhook.get("/", (c)=>{
    console.log("here")
    return c.json({"mes":"122"});
})

usersWebhook.post('/', async (c) => {
   console.log("post");
   
  
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

    switch(eventType){
        case "user.created":
        case "user.updated":{
            const email = evt.data.email_addresses.find(email => email.id === evt.data.primary_email_address_id)?.email_address;
            const name = `${evt.data.first_name} ${evt.data.last_name}`.trim();
            if(!email){
                return c.json({error: 'No email'},400);
            }
            if(!name){
                return c.json({error: 'No name'},400);
            }
            if(eventType === 'user.created'){
              const user = await insertUser({
                clerk_user_id: evt.data.id,
                email,
                name,
                image_url: evt.data.image_url,
              });

              await syncClerkUserMetadata(user);
            }else{
               await updateUser({clerkUserId: evt.data.id},{
                email,
                name,
                image_url: evt.data.image_url,
                role: evt.data.public_metadata.role,
              });
            }
            break;
        }

        case "user.deleted":{
            if(evt.data.id){
                await deleteUser({clerkUserId: evt.data.id});
            }
            break;
        }
    }
    return c.json({status: 'success'})
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return c.json({error: 'Verification failed'},400);
  }
})

const insertUser = async (body: UserInsert)=> {
    const [newUser]  = await db.insert(UserTable).values(body).returning().onConflictDoUpdate({
        target:[UserTable.clerk_user_id],
        set: body,
    });

    if(!newUser){
        throw new Error('Failed to create user');
    }

    return newUser;
};

const updateUser = async (eventData:{clerkUserId: string},body: Partial<UserInsert>)=> {
    const {clerkUserId} = eventData;
    const [updatedUser]  = await db.update(UserTable).set(body).where(eq(UserTable.clerk_user_id, clerkUserId)).returning();

    if(!updatedUser){
        throw new Error('Failed to update user');
    }

    return updatedUser;
};


const deleteUser = async (eventData:{clerkUserId: string})=> {
    const {clerkUserId} = eventData;
    const [deletedUser]  = await db.delete(UserTable).where(eq(UserTable.clerk_user_id, clerkUserId)).returning();

    if(!deletedUser){
        throw new Error('Failed to delete user');
    }

    return deletedUser;
}

export default usersWebhook;