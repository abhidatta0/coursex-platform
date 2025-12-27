CREATE TYPE "public"."order_status" AS ENUM('confirmed', 'pending', 'failed');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'initiated', 'failed');--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "payment_status" "payment_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "order_status" "order_status" NOT NULL;