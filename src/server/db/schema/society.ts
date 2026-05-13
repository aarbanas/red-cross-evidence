import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { cities } from '~/server/db/schema/user';

export const societies = pgTable('society', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  director: varchar('director', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  cityId: uuid('city_id').references(() => cities.id, { onDelete: 'cascade' }),
});

export const societiesRelations = relations(societies, ({ one, many }) => ({
  city: one(cities, {
    relationName: 'societies_cities',
    references: [cities.id],
    fields: [societies.cityId],
  }),
  citySocieties: many(citySocieties),
}));

export const citySocieties = pgTable('city_society', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  director: varchar('director', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  cityId: uuid('city_id').references(() => cities.id, { onDelete: 'cascade' }),
  societyId: uuid('society_id').references(() => societies.id, {
    onDelete: 'cascade',
  }),
});

export const citySocietiesRelations = relations(citySocieties, ({ one }) => ({
  city: one(cities, {
    relationName: 'citySocieties_cities',
    references: [cities.id],
    fields: [citySocieties.cityId],
  }),
  society: one(societies, {
    relationName: 'citySocieties_societies',
    references: [societies.id],
    fields: [citySocieties.societyId],
  }),
}));
