import { error } from '@sveltejs/kit';
import { ROLES } from '$lib/types';

type AllowedRole = typeof ROLES[keyof typeof ROLES];

interface RequireRoleOptions {
  requireOrganization?: boolean;
}

function getUser(locals: App.Locals) {
  const user = locals.userProfile
  if (!user) {
    throw error(401, 'Unauthorized')
  }
  return user
}

export function requireRole(
  locals: App.Locals,
  allowedRoles: AllowedRole[],
  options: RequireRoleOptions = {}
) {
  const user = getUser(locals);

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

export function getUserId(locals: App.Locals) {
  const user = getUser(locals);
  return user.id
}

export function getUserOrgid(locals: App.Locals) {
  const user = getUser(locals)
  if (!user.organization_id) {
    throw error(403, 'User has no organization');
  }
  return user.organization_id
}

export function getUserRole(locals: App.Locals) {
  const user = getUser(locals);
  return user.role;
}