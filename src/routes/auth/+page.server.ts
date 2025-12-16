import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/users';
import { and, eq } from 'drizzle-orm';
import { ROLES } from '$lib/types';

const isValidInput = (email: unknown, password: unknown): boolean => {
  return (
    typeof email === 'string' &&
    email.length > 0 &&
    typeof password === 'string' &&
    password.length > 0
  );
};

const getRedirectPathForRole = (role: string): string => {
  switch (role) {
    case ROLES.SUPER_ADMIN: return '/super/dashboard';
    case ROLES.ADMIN: return '/admin/dashboard';
    case ROLES.USER: return '/org/billing';
    default: return '/';
  }
};

export const actions: Actions = {
  signin: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!isValidInput(email, password)) {
      return fail(400, { message: 'Email and Password are required' });
    }

    try {
      const { data, error: authError } = await locals.supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
      });

      if (authError) {
        return fail(400, { message: authError.message });
      }

      const dbUser = await db.query.users.findFirst({
        where: and(
          eq(users.auth_uid, data.user.id),
          eq(users.is_active, true),
          eq(users.is_deleted, false)
        ),
        columns: { role: true }
      });

      if (!dbUser) {
        await locals.supabase.auth.signOut();
        return fail(403, { message: 'Account exists but no profile found.' });
      }

      const redirectPath = getRedirectPathForRole(dbUser.role);

      throw redirect(303, redirectPath);

    } catch (err) {
      if ((err as { status?: number }).status === 303) {
        throw err;
      }

      console.error('Login error:', err);
      return fail(500, { message: 'Something went wrong. Please try again.' });
    }
  },

  signout: async ({ locals }) => {
    try {
      await locals.supabase.auth.signOut()
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
    throw redirect(303, '/auth/signin')
  },
};