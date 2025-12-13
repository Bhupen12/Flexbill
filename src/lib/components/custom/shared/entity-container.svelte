<script lang="ts">
	import type { Snippet } from 'svelte';

	type EntityContainerProps = {
		children: Snippet;
		header?: Snippet;
		search?: Snippet;
		pagination?: Snippet;
	};

	const { header, search, pagination, children }: EntityContainerProps = $props();
</script>

<div class="p-4 md:px-10 md:py-6 h-full">
	<div class="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
		{#if header}
			{@render header?.()}
		{/if}
		<div class="flex flex-col gap-y-4 h-full">
			{#if search}
				{@render search?.()}
			{/if}
			{@render children?.()}
		</div>
		{#if pagination}
			{@render pagination?.()}
		{/if}
	</div>
</div>
