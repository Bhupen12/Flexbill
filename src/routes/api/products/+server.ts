import { requireRole } from "$lib/server/auth/requireRole";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";
import { productInsertSchema } from "$lib/server/validation";
import { ROLES } from "$lib/types";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
  const currentUser = requireRole(locals, [ROLES.ADMIN], {
    requireOrganization: true
  });

  let requestData;
  try {
    requestData = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  const productPayload = {
    ...requestData,
    organization_id: currentUser.organization_id
  };

  const parsed = productInsertSchema.safeParse(productPayload);

  if (!parsed.success) {
    return json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors
    }, { status: 400 });
  }

  try {
    const result = await db.insert(products).values(parsed.data).returning();

    if (result.length === 0) {
      throw error(500, 'Product creation failed unexpectedly.');
    }

    return json(result[0], { status: 201 });

  } catch (err) {
    console.error('Database Insert Error:', err);

    return json({
      success: false,
      message: 'Failed to save product to database.'
    }, { status: 500 });
  }
};