import { UserRole } from "../types";

export function canAccessAdminPages(role: UserRole|undefined){
   return role === 'admin';
}