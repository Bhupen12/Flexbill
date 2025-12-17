import { json, type RequestHandler } from "@sveltejs/kit";

import { db } from "$lib/server/db";
import { organizations } from "$lib/server/db/schema";
import {
  organizationInsertSchema,
  organizationSelectSchema
} from "$lib/server/validation/organizations";
import { resolvePagination } from "$lib/utils/pagination";
import { sql } from "drizzle-orm";
import { ilike } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
  const { page, size, offset } = resolvePagination(url);
  const search = url.searchParams.get('search')?.trim();

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(organizations)
      .where(search ? ilike(organizations.name, `%${search}%`) : undefined)
      .limit(size)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(organizations)
  ]);

  return json({
    data: organizationSelectSchema.array().parse(data),
    page,
    size,
    total: totalResult[0].count
  });
}

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const parsed = organizationInsertSchema.parse(data);
  const result = await db.insert(organizations).values(parsed).returning();
  if (result.length === 0) {
    return new Response(JSON.stringify({ error: "Insert failed" }), { status: 500 });
  }
  const inserted = organizationSelectSchema.parse(result[0]);
  return json(inserted, { status: 201 });
}