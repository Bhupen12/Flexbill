import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { ROLES } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.userProfile;
    if (!user) {
        throw redirect(303, '/auth/signin');
    }

    if (user.role !== ROLES.SUPER_ADMIN) {
        throw error(403, 'Forbidden: You need Super Admin access.');
    }

    return { user };
};