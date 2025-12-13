import { json, type RequestHandler } from "@sveltejs/kit";

import { db } from "$lib/server/db";
import { organizations } from "$lib/server/db/schema";
import {
  organizationInsertSchema,
  organizationSelectSchema
} from "$lib/server/validation/organizations";

export const GET: RequestHandler = async () => {
  const result = await db.select().from(organizations);
  const parsed = organizationSelectSchema.array().parse(result);
   return json(parsed, { status: 200 });
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