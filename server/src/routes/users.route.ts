import { db } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { standardResponse } from '@/helpers/responseHelper';
import { inArray } from 'drizzle-orm';
import { Hono } from 'hono';

const usersRoute = new Hono();

usersRoute.get('/',async (c)=>{

    return c.json({"message":"Hello users"})
});

usersRoute.post('batchUserInfo', async (c)=>{
    const {userIds} = await c.req.json();

    const userInfos = await db.query.UserTable.findMany({
        where: inArray(UserTable.id, userIds),
        columns:{name: true, id: true}
    });


    return c.json(standardResponse(userInfos));
})


export default usersRoute;