import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { id , timestamps} from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { CourseProductTable } from './courseProduct';
import { UserCourseAccessTable } from './userCourseAccess';
import { CourseSectionTable } from '@/drizzle/schema';
import { CourseAuthorsTable } from '@/drizzle/schema/courseAuthors';

export const CourseTable = pgTable('courses',{
    id,
    name: varchar().notNull(),
    description: text().notNull(),
    ...timestamps,
});

export const CourseRelations = relations(CourseTable,({many})=>({
    courseProducts: many(CourseProductTable),
    userCourseAccess: many(UserCourseAccessTable),
    courseSections: many(CourseSectionTable),
    authors: many(CourseAuthorsTable),
}))

export type CourseInsert = typeof CourseTable.$inferInsert;