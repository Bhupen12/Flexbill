import { getContext, setContext } from 'svelte';

import type { Role } from '$lib/types';

const AUTH_CTX = Symbol('AUTH_CTX');

export type AuthContext = {
  userId: string;
  role: Role;
  email: string;
};

export function setAuthContext(data: AuthContext) {
  setContext(AUTH_CTX, data);
}

export function useAuth() {
  const ctx = getContext<AuthContext>(AUTH_CTX);
  if (!ctx) throw new Error('Auth context not found');
  return ctx;
}
