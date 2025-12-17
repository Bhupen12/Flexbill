import { error, json } from '@sveltejs/kit';

import { requireAdminOrSuper } from '$lib/server/auth/requireRole';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { ROLES } from '$lib/types';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/auth/admin';

export const POST: RequestHandler = async ({ request, locals }) => {

  const currentUser = requireAdminOrSuper(locals);

  const data = await request.json();
  const {
    email,
    password,
    full_name,
    role,
    organization_id
  } = data;

  if (currentUser.role === ROLES.ADMIN) {
    if (role !== ROLES.USER) {
      throw error(403, 'Admin can only create users');
    }
    if (organization_id !== currentUser.organization_id) {
      throw error(403, 'Invalid organization');
    }
  }

  // auth creation
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
    const [createdUser] = await db.transaction(async (tx) => {
      return await tx
        .insert(users)
        .values({
          auth_uid: authUid,
          email,
          full_name,
          role,
          organization_id,
          is_active: true
        })
        .returning();
    });

    return json(createdUser, { status: 201 });

  } catch {
    await supabaseAdmin.auth.admin.deleteUser(authUid);
    throw error(500, 'User creation failed');
  }
};
