import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        userProfile: locals.userProfile,
        session: (await locals.safeGetSession()).session
    };
};