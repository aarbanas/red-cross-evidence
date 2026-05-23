import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { profiles } from '~/server/db/schema/user';

export const equipment = pgTable('equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  size: varchar('size', { length: 255 }).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const equipmentRelations = relations(equipment, ({ many }) => ({
  profileEquipment: many(profileEquipment),
}));

export const profileEquipment = pgTable(
  'profile_equipment',
  {
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    equipmentId: uuid('equipment_id')
      .notNull()
      .references(() => equipment.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull(),
    dateOfRent: date('date_of_rent').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.profileId, table.equipmentId] }),
  }),
);

export const profileEquipmentRelations = relations(
  profileEquipment,
  ({ one }) => ({
    profile: one(profiles, {
      relationName: 'profile_equipment_profiles',
      fields: [profileEquipment.profileId],
      references: [profiles.id],
    }),
    equipment: one(equipment, {
      relationName: 'profile_equipment_equipment',
      fields: [profileEquipment.equipmentId],
      references: [equipment.id],
    }),
  }),
);
