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