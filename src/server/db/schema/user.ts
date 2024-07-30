import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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

export enum Sex {
  MALE = "M",
  FEMALE = "F",
}

export enum ClothingSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

export enum License {
  DRIVING = "driving",
}

export enum WorkStatus {
  EMPLOYED = "EMPLOYED",
  UNEMPLOYED = "UNEMPLOYED",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  STUDENT = "STUDENT",
  RETIRED = "RETIRED",
}

export enum LanguageLevel {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

export const sexEnum = pgEnum(
  "sexenum",
  Object.values(Sex) as [string, ...string[]],
);

export const clothingSizeEnum = pgEnum(
  "clothingsize",
  Object.values(ClothingSize) as [string, ...string[]],
);

export const workStatusEnum = pgEnum(
  "workstatus",
  Object.values(WorkStatus) as [string, ...string[]],
);

export const languageLevelEnum = pgEnum(
  "languagelevel",
  Object.values(LanguageLevel) as [string, ...string[]],
);

export const users = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }),
    active: boolean("active").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => {
    return {
      idx_created_at_uuid: index("idx_created_at_uuid").on(
        table.createdAt,
        table.id,
      ), // composite index
    };
  },
);

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    relationName: "users_profiles",
    references: [profiles.userId],
    fields: [users.id],
  }),
}));

export const profiles = pgTable("profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  oib: varchar("oib", { length: 11 }).notNull().unique(),
  sex: sexEnum("sex").notNull(),
  birthDate: date("birth_date"),
  parentName: varchar("parent_name", { length: 255 }),
  nationality: varchar("nationality", { length: 255 }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sizeId: uuid("size_id").references(() => sizes.id, { onDelete: "cascade" }),
  addressId: uuid("address_id").references(() => addresses.id), // TODO manually take care of deletion
  workStatusId: uuid("work_status_id").references(() => workStatuses.id, {
    onDelete: "cascade",
  }),
  languageId: uuid("language_id").references(() => languages.id, {
    onDelete: "cascade",
  }),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  size: one(sizes, {
    relationName: "profiles_sizes",
    references: [sizes.id],
    fields: [profiles.sizeId],
  }),
  workStatus: one(workStatuses, {
    relationName: "profiles_work_statuses",
    references: [workStatuses.id],
    fields: [profiles.workStatusId],
  }),
  language: one(languages, {
    relationName: "profiles_languages",
    references: [languages.id],
    fields: [profiles.languageId],
  }),
  addresses: many(addresses),
}));

export const sizes = pgTable("profile_size", {
  id: uuid("id").defaultRandom().primaryKey(),
  shoeSize: real("shoe_size"),
  clothingSize: clothingSizeEnum("clothing_size"),
  height: real("height"),
  weight: real("weight"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const addresses = pgTable("address", {
  id: uuid("id").defaultRandom().primaryKey(),
  street: varchar("street", { length: 255 }).notNull(),
  streetNumber: varchar("street_number", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  cityId: uuid("city_id").references(() => cities.id, { onDelete: "cascade" }),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  city: one(cities, {
    relationName: "addresses_cities",
    references: [cities.id],
    fields: [addresses.cityId],
  }),
  profile: one(profiles, {
    relationName: "addresses_profiles",
    references: [profiles.id],
    fields: [addresses.id],
  }),
}));

export const cities = pgTable("city", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  countryId: uuid("country_id").references(() => countries.id, {
    onDelete: "cascade",
  }),
});

export const citiesRelations = relations(cities, ({ one, many }) => ({
  country: one(countries, {
    relationName: "cities_countries",
    references: [countries.id],
    fields: [cities.countryId],
  }),
  addresses: many(addresses),
}));

export const countries = pgTable("country", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export const workStatuses = pgTable("work_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: workStatusEnum("status").notNull(),
  profession: varchar("profession", { length: 255 }),
  institution: varchar("institution", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const languages = pgTable(
  "language",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    level: languageLevelEnum("level").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => {
    return {
      idx_name: uniqueIndex("idx_name").on(table.name, table.level),
    };
  },
);
