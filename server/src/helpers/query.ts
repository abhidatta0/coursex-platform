import { CourseSectionTable, LessonTable } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";

export const wherePublicCourseSections = eq(CourseSectionTable.status, "public");
export const wherePublicLessons = or(
  eq(LessonTable.status, "public"),
  eq(LessonTable.status, "preview")
)