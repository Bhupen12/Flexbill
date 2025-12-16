import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code'),
  timezone: text('timezone').default('UTC').notNull(),
  currency: text('currency').default('INR').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
