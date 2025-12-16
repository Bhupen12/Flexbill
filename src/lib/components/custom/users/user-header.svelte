<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import EntityHeader from '../shared/entity-header.svelte';

	type OrganizationHeaderProps = {
		disabled?: boolean;
	};
	const { disabled = false }: OrganizationHeaderProps = $props();

	function getRandomNumber() {
		return Math.floor(Math.random() * 1000);
	}
	async function handleCreate() {
		try {
			await organizationsApi.create({
				name: `Temp: ${getRandomNumber()}`
			});
			toast.success('New Org Created');
		} catch (error) {
			toast.error('Error Creating New Organization');
		}
	}
</script>

<EntityHeader
	title="Users"
	subtitle="Manage your users here."
	onNew={handleCreate}
	newButtonLabel="Create Users"
	{disabled}
	isCreating={false}
/>
