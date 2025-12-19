import { CourseList, CreateCoursePayload , Course,
    CreateSectionPayload,
    CreateLessonPayload,
} from "@/features/admin/courses/types";
import apiClient from "@/lib/app/apiClient";
import config from "@/lib/app/config";

const BASE_COURSE_URL = `${config.BACKEND_URL}/course`;
const BASE_SECTION_URL = `${config.BACKEND_URL}/section`;
const SECTION_ORDER_URL = `${config.BACKEND_URL}/section/ordering`;
const BASE_LESSON_URL = `${config.BACKEND_URL}/lesson`;
const LESSON_ORDER_URL = `${config.BACKEND_URL}/lesson/ordering`;

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

export const updateCourse = async (id: string,courseData: Partial<CreateCoursePayload>) => {
    const {data} = await apiClient.put(`${BASE_COURSE_URL}/${id}`, courseData);
    return data;
};


export const createSection = async (sectionData: CreateSectionPayload) => {
    const {data} = await apiClient.post(BASE_SECTION_URL, sectionData);
    return data;
};

export const updateSectionOrder = async (sectionIds : string[]) => {
    const {data} = await apiClient.put(SECTION_ORDER_URL, {sectionIds});
    return data;
};

export const updateSection = async (id: string,sectionData: Partial<CreateSectionPayload>) => {
    const {data} = await apiClient.put(`${BASE_SECTION_URL}/${id}`, sectionData);
    return data;
};

export const deleteSection = async (id: string) => {
    const {data} = await apiClient.delete(`${BASE_SECTION_URL}/${id}`);
    return data;
};

export const createlesson = async (courseData: CreateLessonPayload) => {
    const {data} = await apiClient.post(BASE_LESSON_URL, courseData);
    return data;
};

export const updateLessonOrder = async (lessonIds : string[]) => {
    const {data} = await apiClient.put(LESSON_ORDER_URL, {lessonIds});
    return data;
};

export const updateLesson = async (id: string,lessonData: Partial<CreateLessonPayload>) => {
    const {data} = await apiClient.put(`${BASE_LESSON_URL}/${id}`, lessonData);
    return data;
};

export const deleteLesson = async (id: string) => {
    const {data} = await apiClient.delete(`${BASE_LESSON_URL}/${id}`);
    return data;
};