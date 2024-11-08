import { pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

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
