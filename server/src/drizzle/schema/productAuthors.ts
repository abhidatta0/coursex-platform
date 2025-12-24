import { boolean, pgTable, primaryKey, uuid} from "drizzle-orm/pg-core"
import { UserTable } from './user';
import { ProductTable } from "./product";
import { relations } from "drizzle-orm";

export const ProductAuthorsTable = pgTable(
  "product_authors",
  {
    product_id: uuid()
      .notNull()
      .references(() => ProductTable.id, { onDelete: "cascade" }),
    author_id: uuid()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    is_primary: boolean().notNull().default(false), 
  },
  (table) => [
    primaryKey({ columns: [table.product_id, table.author_id] }),
  ],
);

export const ProductAuthorRelations = relations(ProductAuthorsTable,({one})=>({
  product: one(ProductTable,{
    fields:[ProductAuthorsTable.product_id],
    references:[ProductTable.id]
  }),
  author: one(UserTable,{
    fields:[ProductAuthorsTable.author_id],
    references:[UserTable.id]
  })
}))