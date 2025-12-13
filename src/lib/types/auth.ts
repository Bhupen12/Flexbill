export type ClaimType = {
  id: number
  scope: Role
}

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];