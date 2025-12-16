import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { userSelectSchema } from "$lib/server/validation/users";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

const isValidId = (id: string | undefined): boolean => {
  return !!id && id.trim().length > 0;
};

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  if (!isValidId(id)) {
    error(400, "ID is required");
  }

  const rows = await db
    .select()
    .from(users)
    .where(and(
      eq(users.id, id!),
      eq(users.is_deleted, true),
    ));

  if (rows.length === 0) {
    error(404, "User not found");
  }

  const parsed = userSelectSchema.parse(rows[0]);
  return json(parsed);
};