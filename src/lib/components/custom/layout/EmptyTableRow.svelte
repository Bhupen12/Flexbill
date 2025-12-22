<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Empty from '$lib/components/ui/empty';
	import { Inbox } from '@lucide/svelte';

	let { colspan } = $props<{ colspan: number }>();
</script>

<Table.Row>
	<Table.Cell {colspan} class="h-96 text-center">
		<div class="flex h-full w-full items-center justify-center">
			<Empty.Root>
				<Empty.Header>
					<Empty.Media variant="icon" class="mx-auto">
						<Inbox class="size-10 text-muted-foreground" />
					</Empty.Media>
					<Empty.Title>No records found</Empty.Title>
					<Empty.Description>You haven't created any record yet. Get started by creating your first Record.</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		</div>
	</Table.Cell>
</Table.Row>
