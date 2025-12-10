import { Hono } from 'hono';

const usersRoute = new Hono();

usersRoute.get('/',async (c)=>{

    return c.json({"message":"Hello users"})
});


export default usersRoute;