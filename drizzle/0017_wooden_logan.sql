CREATE TABLE "app_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"metadata" text,
	CONSTRAINT "app_config_key_metadata_unique" UNIQUE NULLS NOT DISTINCT("key","metadata")
);
