import { CreateCoursePayload } from "@/features/admin/courses/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const COURSE_CREATE_URL = `${config.BACKEND_URL}/course`;

export const createCourse = async (courseData: CreateCoursePayload) => {
    const {data} = await apiClient.post(COURSE_CREATE_URL, courseData);
    return data;
};