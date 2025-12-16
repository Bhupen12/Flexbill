import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { users } from "../db/schema";
import type z from "zod";

export const userInsertSchema =  createInsertSchema(users);
export type userInsertType = z.infer<typeof userInsertSchema>;

export const userSelectSchema = createSelectSchema(users);
export type userSelectType = z.infer<typeof userSelectSchema>;

export const userUpdateSchema = createUpdateSchema(users);
export type userUpdateType = z.infer<typeof userUpdateSchema>;