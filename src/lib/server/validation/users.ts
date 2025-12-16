import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { users } from "../db/schema";
import type z from "zod";

export const userInsertSchema =  createInsertSchema(users);
export type UserInsertType = z.infer<typeof userInsertSchema>;

export const userSelectSchema = createSelectSchema(users);
export type UserSelectType = z.infer<typeof userSelectSchema>;

export const userUpdateSchema = createUpdateSchema(users);
export type UserUpdateType = z.infer<typeof userUpdateSchema>;