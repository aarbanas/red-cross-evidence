CREATE TYPE "public"."usertype" AS ENUM('EMPLOYEE', 'VOLUNTEER');--> statement-breakpoint
ALTER TABLE "city_society" ALTER COLUMN "phone" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "society" ALTER COLUMN "phone" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "phone" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "type" "usertype" DEFAULT 'VOLUNTEER' NOT NULL;