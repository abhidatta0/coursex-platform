import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { id , timestamps} from '../schemaHelpers.js';
import { relations } from 'drizzle-orm';
import { CourseProductTable } from './courseProduct.js';
import { UserCourseAccessTable } from './userCourseAccess.js';

export const CourseTable = pgTable('courses',{
    id,
    name: varchar().notNull(),
    description: text().notNull(),
    ...timestamps,
});

export const CourseRelations = relations(CourseTable,({many})=>({
    courseProducts: many(CourseProductTable),
    userCourseAccess: many(UserCourseAccessTable),
}))
