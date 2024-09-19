CREATE TABLE IF NOT EXISTS "profile_language" (
	"profile_id" uuid NOT NULL,
	"language_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_language_profile_id_language_id_pk" PRIMARY KEY("profile_id","language_id")
);
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_language_id_language_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_language" ADD CONSTRAINT "profile_language_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_language" ADD CONSTRAINT "profile_language_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "language_id";