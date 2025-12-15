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
   courseSections: []
   created_at: string
   description: string
   id: string,
   name: string
   updated_at: string,
}