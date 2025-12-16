<script lang="ts">
	import { usersApi } from '$lib/api';
	import type { UserSelectType } from '$lib/types';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let users: UserSelectType[] = [];

	async function fetchAllUsers() {
		try {
			users = await usersApi.list();
		} catch (error) {
			toast.error('Failed to load users. Please try again.');
		}
	}

	onMount(() => {
		fetchAllUsers();
	});
</script>

<div class="flex-1 justify-center items-center">
	{JSON.stringify(users, null, 2)}
</div>
