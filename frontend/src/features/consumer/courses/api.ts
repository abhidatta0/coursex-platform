import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";
import { CourseList } from "./types";
import { Lesson } from "@/features/admin/courses/types";

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


export const getLessonDetails = async (id: string)=>{
  const {data}  = await apiClient.get<Lesson>(`${BASE_LESSON_URL}/${id}`);
  return data;
}

export const checkLessonAccess = async (payload:{userId:string, lessonId:string})=>{
  const {data}  = await apiClient.post<boolean>(`${BASE_LESSON_URL}/checkAccess`,payload);
  return data;
}

export const checkLessonIsCompleted = async (params:{userId:string, lessonId:string})=>{
  const {data}  = await apiClient.get<boolean>(`${BASE_LESSON_URL}/checkLessonComplete/${params.userId}/${params.lessonId}`);
  return data;
}