import { json, type RequestHandler } from "@sveltejs/kit";

import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import {
  userInsertSchema,
  userSelectSchema
} from "$lib/server/validation/users";

export const GET: RequestHandler = async () => {
  const result = await db
    .select()
    .from(users);
  const parsed = userSelectSchema.array().parse(result);
  return json(parsed, { status: 200 });
}

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const parsed = userInsertSchema.parse(data);
  const result = await db.insert(users).values(parsed).returning();
  if (result.length === 0) {
    return new Response(JSON.stringify({ error: "Insert failed" }), { status: 500 });
  }
  const inserted = userSelectSchema.parse(result[0]);
  return json(inserted, { status: 201 });
}