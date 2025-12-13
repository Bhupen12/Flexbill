<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import OrganizationHeader from './organization-header.svelte';
	import EntityContainer from '../shared/entity-container.svelte';

	const { children }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<EntityContainer>
	{#snippet header()}
		<OrganizationHeader />
	{/snippet}
	{@render children?.()}
</EntityContainer>
