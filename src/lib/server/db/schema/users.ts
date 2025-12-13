import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const roleEnum = pgEnum('user_role', ['super-admin', 'admin', 'user']);

// users (linked to supabase auth)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  auth_uid: uuid('auth_uid'),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  full_name: text('full_name'),
  phone: text('phone'),
  is_active: boolean('is_active').default(true).notNull(),
  role: roleEnum('role').default('user').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});