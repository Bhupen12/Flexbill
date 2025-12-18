import { error } from '@sveltejs/kit';
import { ROLES } from '$lib/types';

type AllowedRole = typeof ROLES[keyof typeof ROLES];

interface RequireRoleOptions {
  requireOrganization?: boolean;
}

export function requireRole(
  locals: App.Locals,
  allowedRoles: AllowedRole[],
  options: RequireRoleOptions = {}
) {
  const user = locals.userProfile;

  if (!user) {
    throw error(401, 'Unauthorized');
  }

  if (!allowedRoles.includes(user.role)) {
    throw error(403, 'Forbidden');
  }

  if (options.requireOrganization) {
    if (!user.organization_id) {
      throw error(403, 'User has no organization');
    }
  }

  return user;
}

export function requireSuperAdmin(locals: App.Locals) {
  return requireRole(locals, [ROLES.SUPER_ADMIN]);
}

export function requireAdminOrSuper(locals: App.Locals) {
  return requireRole(locals, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
}
