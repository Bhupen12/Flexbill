// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ClaimType } from "$lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			claims: ClaimType
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
