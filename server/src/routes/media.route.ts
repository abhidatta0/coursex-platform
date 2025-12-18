import {Hono} from 'hono';
import {encodeBase64} from 'hono/utils/encode';
import { uploadMediaToCloudinary} from '../helpers/cloudinary';

const mediaRoute = new Hono();

mediaRoute.post("/upload", async (c)=>{
    const body = await c.req.parseBody();
    const file = body.file as File;
    const byteArrayBuffer = await file.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);
    const result = await uploadMediaToCloudinary(`data:image/png;base64,${base64}`);
    return c.json(result);
})


export default mediaRoute;