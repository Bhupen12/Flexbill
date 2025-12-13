<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import EntityContainer from '../shared/entity-container.svelte';
	import OrganizationHeader from './organization-header.svelte';

	const {
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { children?: Snippet } = $props();
</script>

<EntityContainer>
	{#snippet header()}
		<OrganizationHeader />
	{/snippet}
	{@render children?.()}
</EntityContainer>
