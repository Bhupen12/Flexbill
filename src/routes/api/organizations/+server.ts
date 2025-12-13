import type { RequestHandler } from "@sveltejs/kit";

import { db } from "$lib/server/db";
import { organizations } from "$lib/server/db/schema";
import {
  type OrganizationInsert,
  organizationInsertSchema,
  organizationSelectSchema
} from "$lib/server/validation/organizations";

export const GET: RequestHandler = async () => {
  const result = await db.select().from(organizations);
  console.log(result)
  const parsed = organizationSelectSchema.array().parse(result);
  return new Response(JSON.stringify(parsed), { status: 200 });
}

export const POST: RequestHandler = async ({ request }) => {
  const data: OrganizationInsert = await request.json();
  const parsed = organizationInsertSchema.parse(data);
  const result = await db.insert(organizations).values(parsed).returning();
  const inserted = organizationSelectSchema.parse(result[0]);
  return new Response(JSON.stringify(inserted), { status: 201 });
}