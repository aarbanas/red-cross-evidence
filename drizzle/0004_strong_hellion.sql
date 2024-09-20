DO $$ BEGIN
 CREATE TYPE "public"."addresstype" AS ENUM('permanent_residence', 'temporary_residence', 'work', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_address" (
	"profile_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_address_profile_id_address_id_pk" PRIMARY KEY("profile_id","address_id")
);
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_size_id_profile_size_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_address_id_address_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_work_status_id_work_status_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "type" "addresstype" NOT NULL;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "is_primary" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profile_size" ADD COLUMN "profile_id" uuid;--> statement-breakpoint
ALTER TABLE "work_status" ADD COLUMN "profile_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_address" ADD CONSTRAINT "profile_address_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_address" ADD CONSTRAINT "profile_address_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_size" ADD CONSTRAINT "profile_size_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_status" ADD CONSTRAINT "work_status_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "size_id";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "address_id";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "work_status_id";