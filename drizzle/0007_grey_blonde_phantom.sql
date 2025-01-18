CREATE TABLE IF NOT EXISTS "education_term" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date_from" timestamp NOT NULL,
	"date_to" timestamp NOT NULL,
	"max_participants" integer NOT NULL,
	"location" text NOT NULL,
	"lecturer" varchar(255) NOT NULL,
	"education_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_education_term" (
	"profile_id" uuid NOT NULL,
	"education_term_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_education_term_profile_id_education_term_id_pk" PRIMARY KEY("profile_id","education_term_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education_term" ADD CONSTRAINT "education_term_education_id_education_id_fk" FOREIGN KEY ("education_id") REFERENCES "public"."education"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_education_term" ADD CONSTRAINT "profile_education_term_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_education_term" ADD CONSTRAINT "profile_education_term_education_term_id_education_term_id_fk" FOREIGN KEY ("education_term_id") REFERENCES "public"."education_term"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
