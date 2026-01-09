ALTER TABLE "purchases" DROP CONSTRAINT "purchases_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;