import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "~/server/db/schema/user";

export const DrivingLicense = {
  AM: "AM",
  A1: "A1",
  A2: "A2",
  A: "A",
  B: "B",
  BE: "BE",
  C1: "C1",
  C1E: "C1E",
  C: "C",
  CE: "CE",
  D1: "D1",
  D1E: "D1E",
  D: "D",
  DE: "DE",
  F: "F",
  G: "G",
  H: "H",
};

export const licenses = pgTable("license", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const licensesRelations = relations(licenses, ({ many }) => ({
  users: many(users),
}));
