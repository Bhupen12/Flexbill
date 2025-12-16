import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.userProfile;

    if (!user) throw redirect(303, '/auth/signin');
    return { user };
};