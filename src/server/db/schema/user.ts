import {
  boolean,
  date,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { licenses } from "~/server/db/schema/licence";
import { profileEducationTerms } from "~/server/db/schema/education";

export enum AddressType {
  PERMANENT_RESIDENCE = "permanent_residence",
  TEMPORARY_RESIDENCE = "temporary_residence",
  WORK = "work",
  OTHER = "other",
}

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
  OTHER = "O",
}

export enum ClothingSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
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

export const addressEnum = pgEnum(
  "addresstype",
  Object.values(AddressType) as [string, ...string[]],
);

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

export const educationLevelEnum = pgEnum(
  "educationlevel",
  Object.values(EducationLevel) as [string, ...string[]],
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
  birthPlace: varchar("birth_place", { length: 255 }),
  parentName: varchar("parent_name", { length: 255 }),
  nationality: varchar("nationality", { length: 255 }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    relationName: "profiles_users",
    fields: [profiles.userId],
    references: [users.id],
  }),
  profileAddresses: many(profilesAddresses),
  profileSkills: many(profileSkills),
  profilesLanguages: many(profilesLanguages),
  profilesLicences: many(profilesLicences),
  sizes: many(sizes),
  workStatuses: many(workStatuses),
  educationTerms: many(profileEducationTerms),
}));

export const sizes = pgTable("profile_size", {
  id: uuid("id").defaultRandom().primaryKey(),
  shoeSize: real("shoe_size"),
  clothingSize: clothingSizeEnum("clothing_size"),
  height: real("height"),
  weight: real("weight"),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const sizesRelations = relations(sizes, ({ one }) => ({
  profile: one(profiles, {
    relationName: "sizes_profiles",
    references: [profiles.id],
    fields: [sizes.profileId],
  }),
}));

export const addresses = pgTable("address", {
  id: uuid("id").defaultRandom().primaryKey(),
  street: varchar("street", { length: 255 }).notNull(),
  streetNumber: varchar("street_number", { length: 10 }).notNull(),
  type: addressEnum("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  cityId: uuid("city_id").references(() => cities.id, { onDelete: "cascade" }),
});

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  city: one(cities, {
    relationName: "addresses_cities",
    references: [cities.id],
    fields: [addresses.cityId],
  }),
  profilesAddresses: many(profilesAddresses),
}));

export const profilesAddresses = pgTable(
  "profile_address",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    addressId: uuid("address_id")
      .notNull()
      .references(() => addresses.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false), // For now upon creation we will manually set it to primary
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.profileId, table.addressId] }),
  }),
);

export const profilesAddressesRelations = relations(
  profilesAddresses,
  ({ one }) => ({
    profile: one(profiles, {
      relationName: "profiles_addresses_profiles",
      fields: [profilesAddresses.profileId],
      references: [profiles.id],
    }),
    address: one(addresses, {
      relationName: "profiles_addresses_languages",
      fields: [profilesAddresses.addressId],
      references: [addresses.id],
    }),
  }),
);

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
  educationLevel: educationLevelEnum("education_level"),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const workStatusesRelations = relations(workStatuses, ({ one }) => ({
  profile: one(profiles, {
    relationName: "work_statuses_profiles",
    references: [profiles.id],
    fields: [workStatuses.profileId],
  }),
}));

export const languages = pgTable("language", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const languagesRelations = relations(languages, ({ many }) => ({
  profilesLanguages: many(profilesLanguages),
}));

export const profilesLanguages = pgTable(
  "profile_language",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    languageId: uuid("language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "cascade" }),
    level: languageLevelEnum("level").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.profileId, table.languageId] }),
  }),
);

export const profilesLanguagesRelations = relations(
  profilesLanguages,
  ({ one }) => ({
    profile: one(profiles, {
      relationName: "profiles_languages_profiles",
      fields: [profilesLanguages.profileId],
      references: [profiles.id],
    }),
    language: one(languages, {
      relationName: "profiles_languages_languages",
      fields: [profilesLanguages.languageId],
      references: [languages.id],
    }),
  }),
);

export const profilesLicences = pgTable(
  "profile_licence",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    licenceId: uuid("licence_id")
      .notNull()
      .references(() => licenses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk_profile_licence: primaryKey({
        columns: [table.profileId, table.licenceId],
      }),
    };
  },
);

export const profilesLicencesRelations = relations(
  profilesLicences,
  ({ one }) => ({
    profile: one(profiles, {
      relationName: "profiles_licences_profiles",
      fields: [profilesLicences.profileId],
      references: [profiles.id],
    }),
    licence: one(licenses, {
      relationName: "profiles_licences_licences",
      fields: [profilesLicences.licenceId],
      references: [licenses.id],
    }),
  }),
);

export const profileSkills = pgTable("profile_skill", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  profileId: uuid("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
});

export const profileSkillsRelations = relations(profileSkills, ({ one }) => ({
  profile: one(profiles, {
    relationName: "profile_skills_profiles",
    references: [profiles.id],
    fields: [profileSkills.profileId],
  }),
}));
