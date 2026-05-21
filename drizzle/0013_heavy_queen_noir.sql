CREATE TABLE "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"size" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profile_equipment" (
	"profile_id" uuid NOT NULL,
	"equipment_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"date_of_rent" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_equipment_profile_id_equipment_id_pk" PRIMARY KEY("profile_id","equipment_id")
);
--> statement-breakpoint
ALTER TABLE "profile_equipment" ADD CONSTRAINT "profile_equipment_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_equipment" ADD CONSTRAINT "profile_equipment_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;