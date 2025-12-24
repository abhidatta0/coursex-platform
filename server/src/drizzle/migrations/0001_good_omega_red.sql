CREATE TABLE "course_authors" (
	"course_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "course_authors_course_id_author_id_pk" PRIMARY KEY("course_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "product_authors" (
	"product_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "product_authors_product_id_author_id_pk" PRIMARY KEY("product_id","author_id")
);
--> statement-breakpoint
ALTER TABLE "course_authors" ADD CONSTRAINT "course_authors_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_authors" ADD CONSTRAINT "course_authors_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_authors" ADD CONSTRAINT "product_authors_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_authors" ADD CONSTRAINT "product_authors_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;