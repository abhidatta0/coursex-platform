import { sValidator } from "@hono/standard-validator";
import { z } from 'zod';
import { errorResponse } from "./responseHelper";

export const jsonValidation  = <T extends z.ZodSchema>(schema: T)=> {
    return sValidator('json', schema, (result, c)=>{
    if(!result.success){
    // console.log(result.error);
    return c.json(errorResponse(("validation error happened")))
}})
}