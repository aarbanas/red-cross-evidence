import { integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

export const llmUsage = pgTable(
  'llm_usage',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    year: integer('year').notNull(),
    month: integer('month').notNull(),
    callCount: integer('call_count').notNull().default(0),
  },
  (table) => ({
    uniqueYearMonth: unique().on(table.year, table.month),
  }),
);

export const llmConfig = pgTable('llm_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  monthlyLimit: integer('monthly_limit').notNull().default(100),
});

export const appConfig = pgTable(
  'app_config',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    key: text('key').notNull(),
    value: text('value').notNull(),
    metadata: text('metadata'),
  },
  (table) => ({
    uniqueKeyMetadata: unique()
      .on(table.key, table.metadata)
      .nullsNotDistinct(),
  }),
);
