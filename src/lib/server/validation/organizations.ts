import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { organizations } from "../db/schema";
import type z from "zod";

export const organizationInsertSchema =  createInsertSchema(organizations);
export type OrganizationInsert = z.infer<typeof organizationInsertSchema>;

export const organizationSelectSchema = createSelectSchema(organizations);
export type OrganizationSelect = z.infer<typeof organizationSelectSchema>;

export const organizationUpdateSchema = createUpdateSchema(organizations);
export type OrganizationUpdate = z.infer<typeof organizationUpdateSchema>;