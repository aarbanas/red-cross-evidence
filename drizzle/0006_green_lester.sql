DO $$ BEGIN
 CREATE TYPE "public"."educationtypeenum" AS ENUM('Volunteers', 'Public', 'Employee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"precondition" text,
	"duration" varchar(255),
	"lecturers" varchar(255),
	"course_duration" varchar(255),
	"renewal_duration" varchar(255),
	"topics" varchar(255),
	"type" "educationtypeenum" NOT NULL
);
