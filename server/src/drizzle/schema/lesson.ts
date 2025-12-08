import { pgTable, text, uuid, integer, pgEnum } from "drizzle-orm/pg-core"
import { id, timestamps } from "../schemaHelpers.js"
import { relations } from "drizzle-orm"
import { CourseSectionTable } from "./courseSection.js"

export const lessonStatuses = ["public", "private", "preview"] as const
export const lessonStatusEnum = pgEnum("lesson_status", lessonStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text().notNull(),
  description: text(),
  video_url: text().notNull(),
  video_public_id: text().notNull(),  
  order: integer().notNull(),
  status: lessonStatusEnum().notNull().default("private"),
  section_id: uuid()
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const LessonRelationships = relations(LessonTable, ({ one, many }) => ({
  section: one(CourseSectionTable, {
    fields: [LessonTable.section_id],
    references: [CourseSectionTable.id],
  }),
}))