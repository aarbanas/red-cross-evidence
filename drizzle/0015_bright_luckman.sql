CREATE TABLE "llm_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "llm_usage_year_month_unique" UNIQUE("year","month")
);
CREATE TABLE "llm_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monthly_limit" integer DEFAULT 100 NOT NULL
);
INSERT INTO "llm_config" ("monthly_limit") VALUES (100);
