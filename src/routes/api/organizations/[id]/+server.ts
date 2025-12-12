import { db } from "$lib/server/db";
import { organizations } from "$lib/server/db/schema";
import type { UpdateOrganization } from "$lib/types/db";
import type { RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const PUT: RequestHandler = async ({ request, params }) => {
  const id = params.id;
  if (!id) {
    return new Response("Organization ID is required", { status: 400 });
  }
  const data: UpdateOrganization = await request.json();
  
  const result = await db.update(organizations)
    .set(data)
    .where(eq(organizations.id, id))
    .returning();

  return new Response(JSON.stringify(result), { status: 200 });
}

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response("Organization ID is required", { status: 400 });
  }

  const result = await db.delete(organizations)
    .where(eq(organizations.id, id))
    .returning();
  return new Response(JSON.stringify(result), { status: 200 });
}