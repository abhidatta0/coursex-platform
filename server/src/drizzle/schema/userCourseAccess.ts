import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { timestamps } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"
import { CourseTable } from "./course"

export const UserCourseAccessTable = pgTable(
  "user_course_access",
  {
    user_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    course_id: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  t => [primaryKey({ columns: [t.user_id, t.course_id] })]
)

export const UserCourseAccessRelations = relations(
  UserCourseAccessTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserCourseAccessTable.user_id],
      references: [UserTable.id],
    }),
    course: one(CourseTable, {
      fields: [UserCourseAccessTable.course_id],
      references: [CourseTable.id],
    }),
  })
)