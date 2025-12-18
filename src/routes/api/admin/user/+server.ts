import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { supabaseAdmin } from '$lib/server/auth/admin';
import { requireAdminOrSuper } from '$lib/server/auth/requireRole';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';

import { userInsertSchema } from '$lib/server/validation';
import { ROLES } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
  // AuthZ check
  const currentUser = requireAdminOrSuper(locals);

  // Validate input (API schema → includes password)
  const body = await request.json();
  const parsed = userInsertSchema.safeParse(body);

  if (!parsed.success) {
    throw error(400, 'Invalid input');
  }

  const {
    email,
    password,
    full_name,
    role,
    organization_id
  } = parsed.data;

  // Role / org guard
  if (
    currentUser.role === ROLES.ADMIN &&
    (role !== ROLES.USER || organization_id !== currentUser.organization_id)
  ) {
    throw error(403, 'Admin can only create users in their organization');
  }

  // Create auth user (Supabase)
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

  if (authError) {
    throw error(400, authError.message);
  }

  const authUid = authData.user.id;

  try {
    // DB-safe payload (NO password)
    const dbUser = {
      auth_uid: authUid,
      email,
      full_name,
      role,
      organization_id,
      is_active: true
    } satisfies typeof users.$inferInsert;

    // Transaction insert
    const [createdUser] = await db.transaction(async (tx) => {
      return tx
        .insert(users)
        .values(dbUser)
        .returning();
    });

    return json(createdUser, { status: 201 });

  } catch (err) {
    console.error('User creation failed:', err);

    // Rollback auth user if DB insert fails
    await supabaseAdmin.auth.admin.deleteUser(authUid);

    throw error(500, 'User creation failed');
  }
};
