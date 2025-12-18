<script lang="ts">
	import AppSidebar from '$lib/components/custom/domains/layout/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children } = $props();
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
