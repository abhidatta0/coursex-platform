import {
  pgTable,
  integer,
  jsonb,
  uuid,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { id,timestamps } from "../schemaHelpers"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"
import { ProductTable } from "./product"

export const payment_providers = ["stripe", "razorpay"] as const
export const payment_provider_enum = pgEnum("payment_providers", payment_providers);

export const payment_status = ["paid" , "initiated", "failed"] as const
export const payment_status_enum = pgEnum("payment_status", payment_status);

export const order_status = ["confirmed" , "pending", "failed"] as const
export const order_status_enum = pgEnum("order_status", order_status);

export const PurchaseTable = pgTable("purchases", {
  id,
  price_paid_in_cents: integer().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  product_id: uuid()
    .notNull()
    .references(() => ProductTable.id, { onDelete: "restrict" }),
  payment_method: payment_provider_enum().notNull(),
  payment_id: text().notNull(),
  refunded_at: timestamp({ withTimezone: true }),
  payment_status: payment_status_enum().notNull(),
  order_status : order_status_enum().notNull(),
  ...timestamps,
})

export const PurchaseRelations = relations(PurchaseTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PurchaseTable.user_id],
    references: [UserTable.id],
  }),
  product: one(ProductTable, {
    fields: [PurchaseTable.product_id],
    references: [ProductTable.id],
  }),
}))