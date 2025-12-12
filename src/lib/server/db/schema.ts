import { pgTable, uuid, text, timestamp, boolean, jsonb, numeric } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code'),
  timezone: text('timezone').default('UTC').notNull(),
  currency: text('currency').default('INR').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type UpdateOrganization = Partial<NewOrganization>;

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

// customers
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  metadata: jsonb('metadata').default('{}').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// products
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  sku: text('sku'),
  name: text('name').notNull(),
  description: text('description'),
  unit: text('unit').default('pc').notNull(),
  tax_percent: numeric('tax_percent', { precision: 5, scale: 2 }).default('0').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// product_prices (history)
export const product_prices = pgTable('product_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  product_id: uuid('product_id').notNull().references(() => products.id),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  valid_from: timestamp('valid_from').defaultNow().notNull(),
  valid_to: timestamp('valid_to'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// inventory (optional)
export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  product_id: uuid('product_id').notNull().references(() => products.id),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  location: text('location'),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).default('0').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  created_by: uuid('created_by').references(() => users.id),
  customer_id: uuid('customer_id').references(() => customers.id),
  invoice_number: text('invoice_number').notNull(),
  status: text('status').default('draft').notNull(), // draft, issued, paid, cancelled
  net_amount: numeric('net_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  tax_amount: numeric('tax_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  discount_amount: numeric('discount_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  payment_status: text('payment_status').default('unpaid').notNull(),
  metadata: jsonb('metadata').default('{}').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// invoice_items
export const invoice_items = pgTable('invoice_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoice_id: uuid('invoice_id').notNull().references(() => invoices.id),
  product_id: uuid('product_id').references(() => products.id),
  description: text('description'),
  qty: numeric('qty', { precision: 10, scale: 3 }).default('1').notNull(),
  unit_price: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  tax_percent: numeric('tax_percent', { precision: 5, scale: 2 }).default('0').notNull(),
  line_total: numeric('line_total', { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoice_id: uuid('invoice_id').notNull().references(() => invoices.id),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  paid_by: uuid('paid_by').references(() => users.id),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  method: text('method'),
  reference: text('reference'),
  paid_at: timestamp('paid_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// discounts
export const discounts = pgTable('discounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  code: text('code'),
  name: text('name').notNull(),
  description: text('description'),
  kind: text('kind').default('percentage').notNull(), // percentage | fixed
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  applies_to: text('applies_to').default('product').notNull(), // product, customer, invoice, all
  product_id: uuid('product_id').references(() => products.id),
  customer_id: uuid('customer_id').references(() => customers.id),
  starts_at: timestamp('starts_at').defaultNow().notNull(),
  expires_at: timestamp('expires_at'),
  active: boolean('active').default(true).notNull(),
  single_use: boolean('single_use').default(false).notNull(),
  created_by: uuid('created_by').references(() => users.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// discount_assignments
export const discount_assignments = pgTable('discount_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  discount_id: uuid('discount_id').notNull().references(() => discounts.id),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  customer_id: uuid('customer_id'),
  product_id: uuid('product_id'),
  assigned_by: uuid('assigned_by').references(() => users.id),
  assigned_at: timestamp('assigned_at').defaultNow().notNull()
});

// discount_requests
export const discount_requests = pgTable('discount_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  requested_by: uuid('requested_by').references(() => users.id),
  customer_id: uuid('customer_id'),
  invoice_id: uuid('invoice_id'),
  request_amount: numeric('request_amount', { precision: 12, scale: 2 }),
  requested_kind: text('requested_kind').default('percentage').notNull(),
  reason: text('reason'),
  status: text('status').default('pending').notNull(), // pending, approved, rejected
  reviewed_by: uuid('reviewed_by').references(() => users.id),
  reviewed_at: timestamp('reviewed_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// tax_rates
export const tax_rates = pgTable('tax_rates', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  name: text('name'),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// categories
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// product_categories (many-to-many)
export const product_categories = pgTable('product_categories', {
  product_id: uuid('product_id').notNull().references(() => products.id),
  category_id: uuid('category_id').notNull().references(() => categories.id)
}, (table) => ({
  pk: [table.product_id, table.category_id]
}));

// audit_logs
export const audit_logs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  organization_id: uuid('organization_id').notNull().references(() => organizations.id),
  user_id: uuid('user_id').references(() => users.id),
  entity: text('entity'),
  entity_id: uuid('entity_id'),
  action: text('action'),
  data: jsonb('data').default('{}').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});