import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { users } from "../db/schema";
import z from "zod";

export const userBaseInsertSchema = createInsertSchema(users);
export const userInsertSchema = userBaseInsertSchema.extend({
  password: z.string().min(8, 'Password too short'),
})
export type UserInsertType = z.infer<typeof userBaseInsertSchema>;

export const userSelectSchema = createSelectSchema(users);
export type UserSelectType = z.infer<typeof userSelectSchema>;

export const userUpdateSchema = createUpdateSchema(users);
export type UserUpdateType = z.infer<typeof userUpdateSchema>;