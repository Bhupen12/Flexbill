import { boolean, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  sku: text('sku'),
  name: text('name').notNull(),
  description: text('description'),
  unit: text('unit').default('pc').notNull(),
  base_price: numeric('base_price', { precision: 5, scale: 2 }).default('0').notNull(),
  tax_percent: numeric('tax_percent', { precision: 5, scale: 2 }).default('0').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
