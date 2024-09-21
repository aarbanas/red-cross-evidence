DROP INDEX IF EXISTS "idx_name";--> statement-breakpoint
ALTER TABLE "profile_address" ADD COLUMN "is_primary" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profile_language" ADD COLUMN "level" "languagelevel" NOT NULL;--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN IF EXISTS "is_primary";--> statement-breakpoint
ALTER TABLE "language" DROP COLUMN IF EXISTS "level";