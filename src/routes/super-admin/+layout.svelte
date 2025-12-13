<script lang="ts">
	import AppSidebar from '$lib/components/custom/shared/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { setAuthContext } from '$lib/context/auth.svelte';
	import { ROLES } from '$lib/types';

	let { children } = $props();
	setAuthContext({
		userId: '12345',
		email: 'userEmail',
		role: ROLES.SUPER_ADMIN
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="bg-accent/70">
		<main>
			<Sidebar.Trigger />
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
