import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { id,timestamps  } from "../schemaHelpers.js"
import { relations } from "drizzle-orm"
import { UserCourseAccessTable } from "./userCourseAccess.js"

export const user_roles = ["user", "admin"] as const
export const user_role_enum = pgEnum("user_role", user_roles)

export const UserTable = pgTable("users", {
  id,
  clerk_user_id: text().notNull().unique(),
  email: text().notNull(),
  name: text().notNull(),
  role: user_role_enum().notNull().default("user"),
  image_url: text(),
  deleted_at: timestamp({ withTimezone: true }),
  ...timestamps,
});

export const UserRelations = relations(UserTable, ({many})=>({
    userCourseAccess: many(UserCourseAccessTable),
}))

