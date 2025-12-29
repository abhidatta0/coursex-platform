import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";
import { CourseList } from "./types";

const BASE_STUDENT_COURSES_URL = `${config.BACKEND_URL}/student/course`;
const BASE_LESSON_URL = `${config.BACKEND_URL}/lesson`;

export const getAllCoursesOfUser = async (userId: string)=>{
  const {data}  = await apiClient.get<CourseList>(`${BASE_STUDENT_COURSES_URL}/all/${userId}`);
  return data;
}

export const getCompletedLessonsOfUser = async (userId: string)=>{
  const {data}  = await apiClient.get<string[]>(`${BASE_LESSON_URL}/completed/${userId}`);
  return data;
}