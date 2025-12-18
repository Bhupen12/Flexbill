import { db } from "$lib/server/db";
import { organizations } from "$lib/server/db/schema";
import type { RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

import {
  type OrganizationUpdate,
  organizationSelectSchema,
  organizationUpdateSchema
} from "$lib/server/validation";

const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id) return respond({ error: "Organization ID is required" }, 400);

  const rows = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id));

  if (rows.length === 0) {
    return respond({ error: "Organization not found" }, 404);
  }

  const parsed = organizationSelectSchema.parse(rows[0]);

  return respond(parsed, 200);
};


export const PUT: RequestHandler = async ({ request, params }) => {
  const id = params.id;
  if (!id) return respond({ error: "Organization ID is required" }, 400);

  let json: OrganizationUpdate;

  try {
    json = await request.json();
  } catch {
    return respond({ error: "Invalid JSON body" }, 400);
  }

  const data = organizationUpdateSchema.parse(json);

  const now = new Date();
  const updated = await db
    .update(organizations)
    .set({ ...data, updated_at: now })
    .where(eq(organizations.id, id))
    .returning();

  if (updated.length === 0) {
    return respond({ error: "Organization not found" }, 404);
  }

  const parsed = organizationSelectSchema.parse(updated[0]);
  return respond(parsed, 200);
};


export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id) return respond({ error: "Organization ID is required" }, 400);

  const deleted = await db
    .delete(organizations)
    .where(eq(organizations.id, id))
    .returning();

  if (deleted.length === 0) {
    return respond({ error: "Organization not found" }, 404);
  }

  return respond({ message: "Deleted successfully", deleted: deleted[0] }, 200);
};
