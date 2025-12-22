import { integer, pgTable, text, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { id , timestamps} from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { CourseProductTable } from './courseProduct';


export const productStases = ["public","private"] as const;
export const product_status_enum = pgEnum("product_status", productStases);

export const ProductTable = pgTable('products',{
    id,
    name: varchar().notNull(),
    description: text().notNull(),
    image_url: text().notNull(),
    image_public_id: varchar().notNull(),
    price_in_dollars: integer().notNull(),
    status: product_status_enum().notNull().default('private'),// by default created course will be private
    ...timestamps,
});

export const ProductRelations = relations(ProductTable,({many})=>({
    courseProducts: many(CourseProductTable)
}))

export type ProductInsert = typeof ProductTable.$inferInsert;
export type ProductUpdate = Partial<ProductInsert>;
