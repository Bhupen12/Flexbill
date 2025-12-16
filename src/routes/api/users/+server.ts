import { json, type RequestHandler } from "@sveltejs/kit";
import { sql } from "drizzle-orm";

import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { userInsertSchema, userSelectSchema } from "$lib/server/validation/users";
import { resolvePagination } from "$lib/utils/pagination";

export const GET: RequestHandler = async ({ url }) => {
  const { page, size, offset } = resolvePagination(url);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(users)
      .limit(size)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
  ]);

  return json({
    data: userSelectSchema.array().parse(data),
    page,
    size,
    total: totalResult[0].count
  });
};

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