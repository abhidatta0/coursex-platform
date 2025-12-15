import { CourseList, CreateCoursePayload , Course} from "@/features/admin/courses/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_COURSE_URL = `${config.BACKEND_URL}/course`;

export const createCourse = async (courseData: CreateCoursePayload) => {
    const {data} = await apiClient.post(BASE_COURSE_URL, courseData);
    return data;
};

export const deleteCourse = async (id: string) => {
    const {data} = await apiClient.delete(`${BASE_COURSE_URL}/${id}`);
    return data;
};


export const getAllCourses = async () => {
    const {data} = await apiClient.get<CourseList>(`${BASE_COURSE_URL}`);
    return data;
};

export const fetchCourseById = async (id: string) => {
    const {data} = await apiClient.get<Course>(`${BASE_COURSE_URL}/${id}`);
    return data;
};