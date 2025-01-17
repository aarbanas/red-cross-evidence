import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export enum EducationType {
  VOLUNTEERS = "Volunteers",
  PUBLIC = "Public",
  EMPLOYEE = "Employee",
}

export const educationTypeEnum = pgEnum(
  "educationtypeenum",
  Object.values(EducationType) as [string, ...string[]],
);

export const educations = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  precondition: text("precondition"),
  duration: varchar("duration", { length: 255 }),
  lecturers: varchar("lecturers", { length: 255 }),
  courseDuration: varchar("course_duration", { length: 255 }),
  renewalDuration: varchar("renewal_duration", { length: 255 }),
  topics: varchar("topics", { length: 255 }),
  type: educationTypeEnum("type").notNull(),
});

export const educationsRelations = relations(educations, ({ many }) => ({
  educationTerms: many(educationTerms),
}));

export const educationTerms = pgTable("education_term", {
  id: uuid("id").defaultRandom().primaryKey(),
  dateFrom: timestamp("date_from").notNull(),
  dateTo: timestamp("date_to").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  location: text("location").notNull(),
  lecturers: varchar("lecturer", { length: 255 }).notNull(),
  educationId: uuid("education_id")
    .notNull()
    .references(() => educations.id, { onDelete: "cascade" }),
});

export const educationTermsRelations = relations(educationTerms, ({ one }) => ({
  education: one(educations, {
    relationName: "educations_educationTerms",
    references: [educations.id],
    fields: [educationTerms.educationId],
  }),
}));
