import type { UserRole } from "../drizzle/schema";
import {createClerkClient} from '@clerk/backend';

export async function syncClerkUserMetadata(user:{
    id: string,
    clerk_user_id: string,
    role: UserRole
}){
  const clerkClient = await createClerkClient({publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  return clerkClient.users.updateUserMetadata(user.clerk_user_id,{
    publicMetadata:{
        dbId: user.id,
        role: user.role,
    }
  })
}