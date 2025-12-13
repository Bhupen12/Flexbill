<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import OrganizationGrid from '$lib/components/custom/organization/organization-grid.svelte';
	import type { OrganizationSelect } from '$lib/types';
	import { onMount } from 'svelte';

	let organizations = $state<OrganizationSelect[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function handleAdd(name: string, code: string) {
		await organizationsApi.create({ name, code });
		await getAllOrgs();
	}
	function handleEdit(id: string) {
		// Implement the logic to edit an organization
		console.log('Edit organization:', id);
	}
	function handleDelete(id: string) {
		// Implement the logic to delete an organization
		console.log('Delete organization:', id);
	}

	async function getAllOrgs() {
		loading = true;
		error = null;

		try {
			organizations = await organizationsApi.list();
			console.log(organizations);
		} catch (e) {
			console.error(e);
			error = 'Failed to load organizations';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		getAllOrgs();
	});
</script>

<main class="min-h-screen bg-linear-to-br from-background via-background to-muted/30 p-6 md:p-10">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8">
			<h1 class="text-3xl font-bold tracking-tight text-foreground">Organizations</h1>
			<p class="mt-2 text-muted-foreground">Manage your organizations and their settings.</p>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20 text-muted-foreground">
				Loading organizations...
			</div>
		{:else if error}
			<div class="py-20 text-center text-destructive">
				{error}
			</div>
		{:else}
			<OrganizationGrid
				{organizations}
				{loading}
				onAdd={handleAdd}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
		{/if}
	</div>
</main>
