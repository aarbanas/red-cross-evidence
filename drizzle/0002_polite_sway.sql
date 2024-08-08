DO $$ BEGIN
 CREATE TYPE "public"."clothingsize" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."educationlevel" AS ENUM('primary', 'secondary', 'college', 'bachelor', 'master', 'doctorate', 'post_doctorate');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."languagelevel" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sexenum" AS ENUM('M', 'F', 'O');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."workstatus" AS ENUM('EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'STUDENT', 'RETIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "address" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"street" varchar(255) NOT NULL,
	"street_number" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"city_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"postal_code" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"country_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "language" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"level" "languagelevel" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_licence" (
	"profile_id" uuid NOT NULL,
	"licence_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_licence_profile_id_licence_id_pk" PRIMARY KEY("profile_id","licence_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shoe_size" real,
	"clothing_size" "clothingsize",
	"height" real,
	"weight" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "workstatus" NOT NULL,
	"profession" varchar(255),
	"institution" varchar(255),
	"education_level" "educationlevel",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "oib" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "sex" "sexenum" NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "birth_place" varchar(255);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "parent_name" varchar(255);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "nationality" varchar(255);--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "size_id" uuid;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "address_id" uuid;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "work_status_id" uuid;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "language_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "city" ADD CONSTRAINT "city_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_skill" ADD CONSTRAINT "profile_skill_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_licence" ADD CONSTRAINT "profile_licence_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_licence" ADD CONSTRAINT "profile_licence_licence_id_license_id_fk" FOREIGN KEY ("licence_id") REFERENCES "public"."license"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_name" ON "language" ("name","level");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_size_id_profile_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."profile_size"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_address_id_address_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_work_status_id_work_status_id_fk" FOREIGN KEY ("work_status_id") REFERENCES "public"."work_status"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "country";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "education";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "profession";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_oib_unique" UNIQUE("oib");
