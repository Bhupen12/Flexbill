import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { ROLES } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.userProfile;
  if (!user) {
    throw redirect(303, '/auth/signin');
  }

  if (![ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(user.role as typeof ROLES.SUPER_ADMIN | typeof ROLES.ADMIN)) {
    throw error(403, 'Forbidden: You need Admin access.');
  }

  return { user };
};