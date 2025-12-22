<script lang="ts">
	import AppSidebar from '$lib/components/custom/layout/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="bg-accent/70 h-screen flex flex-col">
		<Sidebar.Trigger />
		<main class="flex-1 md:overflow-hidden">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
