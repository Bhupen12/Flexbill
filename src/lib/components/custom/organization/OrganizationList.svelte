<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import type { OrganizationSelect } from '$lib/types';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let organizations: OrganizationSelect[] = [];

	async function fetchAllOrganizations() {
		try {
			organizations = await organizationsApi.list();
		} catch (error) {
			toast.error('Failed to load organizations. Please try again.');
		}
	}

	onMount(() => {
		fetchAllOrganizations();
	});
</script>

<div class="flex-1 justify-center items-center">
	{JSON.stringify(organizations, null, 2)}
</div>
