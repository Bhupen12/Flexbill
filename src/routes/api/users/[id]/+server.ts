import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { userSelectSchema } from "$lib/server/validation/users";
import type { RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id) return respond({ error: "Users ID is required" }, 400);

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  if (rows.length === 0) {
    return respond({ error: "Users not found" }, 404);
  }

  const parsed = userSelectSchema.parse(rows[0]);

  return respond(parsed, 200);
};