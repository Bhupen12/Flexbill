import { resolvePagination } from "$lib/hooks/pagination";
import { getUserOrgid, getUserRole, requireRole } from "$lib/server/auth/userinfo";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";
import { productInsertSchema } from "$lib/server/validation";
import { ROLES } from "$lib/types";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { and, eq, ilike, or, sql } from "drizzle-orm";

export const GET: RequestHandler = async ({ url, locals }) => {
  const orgid = getUserOrgid(locals);
  const role = getUserRole(locals);

  const { page, size, offset } = resolvePagination(url);

  const search = url.searchParams.get('search')?.trim() || null;
  const statusParam = url.searchParams.get('status');
  let isActiveFilter: boolean | null = null;

  if (statusParam === 'true') isActiveFilter = true;
  if (statusParam === 'false') isActiveFilter = false;

  const conditions = [];

  // only super user can see all products
  if (role !== ROLES.SUPER_ADMIN) {
    conditions.push(eq(products.organization_id, orgid));
  }

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.sku, `%${search}%`)
      )
    );
  }

  if (isActiveFilter !== null) {
    conditions.push(eq(products.is_active, isActiveFilter));
  }

  const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(whereCondition)
      .limit(size)
      .offset(offset)
      .orderBy(products.created_at),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereCondition)
  ]);

  return json({
    data: data,
    page,
    size,
    total: totalResult[0]?.count || 0
  });
}

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