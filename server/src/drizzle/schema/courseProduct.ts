import { pgTable,primaryKey,uuid } from "drizzle-orm/pg-core";
import { CourseTable } from "./course";
import { ProductTable } from "./product";
import { timestamps } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const CourseProductTable = pgTable('course_products',{
    course_id: uuid().notNull().references(()=> CourseTable.id, {onDelete:'restrict'}),
    product_id: uuid().notNull().references(()=> ProductTable.id, {onDelete:'cascade'}),
    ...timestamps,
},(t)=>[
    primaryKey({columns:[t.course_id, t.product_id]})
]);

export const CourseProductRelations = relations(CourseProductTable,({one})=>({
    course: one(CourseTable,{
        fields:[CourseProductTable.course_id],
        references:[CourseTable.id]
    }),
    product: one(ProductTable,{
        fields:[CourseProductTable.product_id],
        references:[ProductTable.id]
    })
}))