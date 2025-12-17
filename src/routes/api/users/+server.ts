import { json, type RequestHandler } from "@sveltejs/kit";
import { and, eq, ilike, sql } from "drizzle-orm";

import { requireRole } from "$lib/server/auth/requireRole";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { userSelectSchema } from "$lib/server/validation/users";
import { ROLES } from "$lib/types";
import { resolvePagination } from "$lib/utils/pagination";

export const GET: RequestHandler = async ({ url, locals }) => {
  const currentUser = requireRole(locals, [ROLES.SUPER_ADMIN, ROLES.ADMIN], {
    sameOrganization: true
  })
  const { page, size, offset } = resolvePagination(url);

  const search = url.searchParams.get('search')?.trim() || null;

  const roleParam = url.searchParams.get('role');
  const role =
    roleParam === ROLES.SUPER_ADMIN ||
      roleParam === ROLES.ADMIN ||
      roleParam === ROLES.USER
      ? roleParam
      : null;

  const conditions = [];

  if (currentUser.role === ROLES.ADMIN) {
    conditions.push(eq(users.organization_id, currentUser.organization_id!));
  }

  if (search) {
    conditions.push(ilike(users.full_name, `%${search}%`));
  }

  if (role) {
    conditions.push(eq(users.role, role));
  }

  const whereCondition =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(users)
      .where(whereCondition)
      .limit(size)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereCondition)
  ]);

  return json({
    data: userSelectSchema.array().parse(data),
    page,
    size,
    total: totalResult[0].count
  });
};
