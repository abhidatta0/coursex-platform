import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { timestamps } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"
import { LessonTable } from "./lesson"

export const UserLessonCompleteTable = pgTable(
  "user_lesson_complete",
  {
    user_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    lesson_id: uuid()
      .notNull()
      .references(() => LessonTable.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  t => [primaryKey({ columns: [t.user_id, t.lesson_id] })]
)

export const UserLessonCompleteRelations = relations(
  UserLessonCompleteTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserLessonCompleteTable.user_id],
      references: [UserTable.id],
    }),
    lesson: one(LessonTable, {
      fields: [UserLessonCompleteTable.lesson_id],
      references: [LessonTable.id],
    }),
  })
)