import { boolean, pgTable, primaryKey, uuid} from "drizzle-orm/pg-core"
import { CourseTable } from "./course";
import { UserTable } from './user';
import { relations } from "drizzle-orm";

export const CourseAuthorsTable = pgTable(
  "course_authors",
  {
    course_id: uuid()
      .notNull()
      .references(() => CourseTable.id, { onDelete: "cascade" }),
    author_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    is_primary: boolean().notNull().default(false), // optional: track primary author
  },
  (table) => [
    primaryKey({ columns: [table.course_id, table.author_id] }),
  ],
);

export const CourseAuthorRelations = relations(CourseAuthorsTable,({one})=>({
  course: one(CourseTable,{
    fields:[CourseAuthorsTable.course_id],
    references:[CourseTable.id]
  }),
  author: one(UserTable,{
    fields:[CourseAuthorsTable.author_id],
    references:[UserTable.id]
  })
}))