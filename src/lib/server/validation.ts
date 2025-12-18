import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { organizations, products, users } from "./db/schema";
import { z } from "zod";

export const organizationInsertSchema = createInsertSchema(organizations);
export type OrganizationInsert = z.infer<typeof organizationInsertSchema>;

export const organizationSelectSchema = createSelectSchema(organizations);
export type OrganizationSelect = z.infer<typeof organizationSelectSchema>;

export const organizationUpdateSchema = createUpdateSchema(organizations);
export type OrganizationUpdate = z.infer<typeof organizationUpdateSchema>;

export const productInsertSchema = createInsertSchema(products);
export type ProductInsertType = z.infer<typeof productInsertSchema>;

export const productSelectSchema = createSelectSchema(products);
export type ProductSelectType = z.infer<typeof productSelectSchema>;

export const productUpdateSchema = createUpdateSchema(products);
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;

export const userBaseInsertSchema = createInsertSchema(users);
export const userInsertSchema = userBaseInsertSchema.extend({
  password: z.string().min(8, 'Password too short'),
})
export type UserInsertType = z.infer<typeof userBaseInsertSchema>;

export const userSelectSchema = createSelectSchema(users);
export type UserSelectType = z.infer<typeof userSelectSchema>;

export const userUpdateSchema = createUpdateSchema(users);
export type UserUpdateType = z.infer<typeof userUpdateSchema>;