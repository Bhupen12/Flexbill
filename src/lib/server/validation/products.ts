import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { products } from "../db/schema";
import type z from "zod";

export const productInsertSchema = createInsertSchema(products);
export type ProductInsertType = z.infer<typeof productInsertSchema>;

export const productSelectSchema = createSelectSchema(products);
export type ProductSelectType = z.infer<typeof productSelectSchema>;

export const productUpdateSchema = createUpdateSchema(products);
export type ProductUpdateType = z.infer<typeof productUpdateSchema>;