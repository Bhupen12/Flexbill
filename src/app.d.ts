// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Role } from '$lib/types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      userProfile: {
        id: string
        role: Role
        email: string
        organization_id: string | null
      } | null
    }
    interface PageData {
      session: Session | null
      userProfile: App.Locals['userProfile']
    }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
