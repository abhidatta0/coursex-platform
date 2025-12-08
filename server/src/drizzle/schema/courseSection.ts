import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { id, timestamps } from "../schemaHelpers.js"
import { CourseTable } from "./course.js"
import { relations } from "drizzle-orm"
import { LessonTable } from "./lesson.js"

export const courseSectionStatuses = ["public", "private"] as const
export const courseSectionStatusEnum = pgEnum(
  "course_section_status",
  courseSectionStatuses
)

export const CourseSectionTable = pgTable("course_sections", {
  id,
  name: text().notNull(),
  status: courseSectionStatusEnum().notNull().default("private"),
  order: integer().notNull(),
  course_id: uuid()
    .notNull()
    .references(() => CourseTable.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const CourseSectionRelations = relations(
  CourseSectionTable,
  ({ one, many }) => ({
    course: one(CourseTable, {
      fields: [CourseSectionTable.course_id],
      references: [CourseTable.id],
    }),
    lessons : many(LessonTable),
  })
)