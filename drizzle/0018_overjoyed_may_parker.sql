CREATE TYPE "public"."userrole" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "userrole" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
UPDATE "user" SET "role" = 'ADMIN' WHERE "email" = 'admin@dck-pgz.hr';