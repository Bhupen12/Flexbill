import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { supabaseAdmin } from '$lib/server/auth/admin';
import { requireAdminOrSuper } from '$lib/server/auth/userinfo';

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';

import { userInsertSchema } from '$lib/server/validation';
import { ROLES } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
  // AuthZ check
  const currentUser = requireAdminOrSuper(locals);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = userInsertSchema.safeParse(body);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return json({ 
      message: 'Validation failed',
      errors: fieldErrors
    }, { status: 400 });
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
    return json(
      { message: 'Admin can only create users in their organization' }, 
      { status: 403 }
    );
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

  if (authError) {
    return json(
      { message: authError.message }, 
      { status: 400 }
    );
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

  } catch (err: any) {
    console.error('User creation failed:', err);

    // Rollback auth user if DB insert fails
    await supabaseAdmin.auth.admin.deleteUser(authUid);

    return json(
      { message: 'User creation failed. Please try again.' }, 
      { status: 500 }
    );
  }
};
