<script lang="ts" generics="T">
	import * as Table from '$lib/components/ui/table';
	import type { Snippet } from 'svelte';
	import EmptyTableRow from '../layout/EmptyTableRow.svelte';
	import TableSkeleton from '../layout/RowLoadingSkeleton.svelte';

	let { loading, data, columns, row } = $props<{
		loading: boolean;
		data: T[];
		columns: { label: string; class?: string }[];
		row: Snippet<[T]>;
	}>();
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row class="bg-muted/50">
				{#each columns as col}
					<Table.Head class={col.class}>{col.label}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#if loading}
				<TableSkeleton columnCount={columns.length} rowCount={5} />
			{:else if data.length === 0}
				<EmptyTableRow colspan={columns.length} />
			{:else}
				{#each data as item}
					{@render row(item)}
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
