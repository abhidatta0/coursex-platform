import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_STUDENT_COURSES_URL = `${config.BACKEND_URL}/student/course`

export const getAllCoursesOfUser = async (userId: string)=>{
  const {data}  = await apiClient.get(`${BASE_STUDENT_COURSES_URL}/all/${userId}`);
  return data;
}