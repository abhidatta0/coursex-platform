import {Hono} from 'hono';
import {encodeBase64} from 'hono/utils/encode';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary} from '../helpers/cloudinary';
import { errorResponse, standardResponse } from '@/helpers/responseHelper';

const mediaRoute = new Hono();

mediaRoute.post("/upload", async (c)=>{
    const body = await c.req.parseBody();
    const file = body.file as File;

    if(file.size >= 5000000){
        return c.json(errorResponse('File size should not be greater than 5MB'));
    }
    const byteArrayBuffer = await file.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);
    const result = await uploadMediaToCloudinary(`data:image/png;base64,${base64}`);
    return c.json(standardResponse(result));
})

mediaRoute.post('/delete',  async (c)=>{
    try{
     const {publicId} = await c.req.json();
     if(!publicId){
        return c.json(errorResponse('Asset Id is required'));
     }
     const result = await deleteMediaFromCloudinary(publicId);
     console.log({result})
      return c.json(standardResponse('Asset deleted successfully'))

    }catch(e){
        return c.json(errorResponse('Error deleting'));
    }
})

export default mediaRoute;