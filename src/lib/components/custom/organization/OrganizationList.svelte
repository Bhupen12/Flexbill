<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import type { OrganizationSelect } from '$lib/types';
	import { onMount } from 'svelte';

	let organizations: OrganizationSelect[] = [];

	async function fetchAllOrganizations() {
		organizations = await organizationsApi.list();
	}

	onMount(() => {
		fetchAllOrganizations();
	});
</script>

<div class="flex-1 justify-center items-center">
	{JSON.stringify(organizations, null, 2)}
</div>
