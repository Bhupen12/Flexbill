import { page } from '$app/stores';
import { ROLES } from '$lib/types';
import { derived } from 'svelte/store';

export const user = derived(page, ($page) => $page.data.userProfile);

export const isLoggedIn = derived(page, ($page) => !!$page.data.userProfile);

export const isSuperAdmin = derived(page, ($page) => $page.data.userProfile?.role === ROLES.SUPER_ADMIN);

export const isAdmin = derived(page, ($page) => $page.data.userProfile?.role === ROLES.ADMIN);