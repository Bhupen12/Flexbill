export type ClaimType = {
  id: number
  scope: ROLES
}

export type ROLES = 'owner' | 'admin' | 'manager' | 'cashier'