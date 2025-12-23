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
   courseSections: SectionWithLesson[]
   created_at: string
   description: string
   id: string,
   name: string
   updated_at: string,
}

export type SectionWithLesson = Section & {
    lessons:Lesson[]
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


export const LESSON_STATUSES = ["public", "private","preview"] as const;
export type LessonStatus = (typeof LESSON_STATUSES)[number];
export type Lesson = {
    id: string,
    name: string,
    status: LessonStatus,
    section_id: string,
    description: string | null,
    video_url: string,
    video_public_id: string,
}
export type CreateLessonPayload = Omit<Lesson,'id'>;