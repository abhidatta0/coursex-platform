export type CreateCoursePayload = {
    name: string,
    description: string,
}

export type CourseList =  {
    id: string;
    name: string;
    sectionsCount: number;
    lessonsCount: number;
    studentsCount: number;
}[];

export type Course = {
   courseSections: CourseSection[]
   created_at: string
   description: string
   id: string,
   name: string
   updated_at: string,
}

type CourseSection = Section & {
    lessons:[]
}

export const SECTION_STATUSES = ["public", "private"] as const;
export type SectionStatus = (typeof SECTION_STATUSES)[number];

export type Section = {
    id: string,
    name: string,
    status: SectionStatus,
    course_id: string,
}

export type CreateSectionPayload = Omit<Section,'id'>

export type Lesson = {
    id: string,
    name: string,
    status: SectionStatus,
    section_id: string,
    description: string | null,
}