import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const roleEnum = pgEnum('user_role', ['super-admin', 'admin', 'user']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  auth_uid: uuid('auth_uid'),
  organization_id: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  email: text('email').notNull(),
  full_name: text('full_name'),
  phone: text('phone'),
  role: roleEnum('role').default('user').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});