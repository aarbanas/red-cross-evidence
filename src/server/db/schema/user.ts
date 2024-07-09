import { boolean, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export enum EducationLevel {
  PRIMARY = "primary", // Osnovno obrazovanje (OŠ)
  SECONDARY = "secondary", // Srednja stručna sprema
  COLLEGE = "college", // Viša stručna sprema
  BACHELOR = "bachelor", // Visoka stručna sprema
  MASTER = "master", //Magistarski studij
  DOCTORATE = "doctorate", // Doktorski studij
  POST_DOCTORATE = "post_doctorate", // Postdoktorski studij
}

export enum Profession {
  DOCTOR = "doctor",
  NURSE = "nurse",
  TECHNICIAN = "technician",
  ADMINISTRATOR = "administrator",
  OTHER = "other",
}

export enum License {
  DRIVING = "driving",
}

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  active: boolean("active").default(false),
});

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    relationName: "users_profiles",
    references: [profiles.userId],
    fields: [users.id],
  }),
}));

export const profiles = pgTable("profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  education: varchar("education"),
  profession: varchar("profession"),
});
