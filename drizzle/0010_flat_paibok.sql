CREATE TABLE "city_society" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"director" varchar(255) NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"city_id" uuid,
	"society_id" uuid
);
--> statement-breakpoint
CREATE TABLE "society" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"director" varchar(255) NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"website" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"city_id" uuid
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "society_id" uuid;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "city_society_id" uuid;--> statement-breakpoint
ALTER TABLE "city_society" ADD CONSTRAINT "city_society_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_society" ADD CONSTRAINT "city_society_society_id_society_id_fk" FOREIGN KEY ("society_id") REFERENCES "public"."society"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "society" ADD CONSTRAINT "society_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE cascade ON UPDATE no action;