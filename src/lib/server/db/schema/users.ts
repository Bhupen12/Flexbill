import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

// users (linked to supabase auth)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  auth_uid: uuid('auth_uid'),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  email: text('email').notNull(),
  full_name: text('full_name'),
  phone: text('phone'),
  is_active: boolean('is_active').default(true).notNull(),
  role: text('role').default('cashier').notNull(), // owner/admin/manager/cashier
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});