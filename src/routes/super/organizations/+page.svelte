<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import type { OrganizationSelect } from '$lib/types';
	import OrganizationCreate from './OrganizationCreate.svelte';
  
	import DataTable from '$lib/components/custom/shared-table/DataTable.svelte';
	import ListPagination from '$lib/components/custom/shared-table/ListPagination.svelte';
	import ListToolbar from '$lib/components/custom/shared-table/ListToolbar.svelte';
  
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { Banknote, Building2, Globe, MoreHorizontal } from '@lucide/svelte';

	let organizations = $state<OrganizationSelect[]>([]);
	let loading = $state(false);
	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	const columns = [
		{ label: 'Organization', class: 'w-75' },
		{ label: 'Code' },
		{ label: 'Timezone' },
		{ label: 'Currency' },
		{ label: 'Actions', class: 'text-right' }
	];

	async function loadOrgs() {
		loading = true;
		try {
			const res = await organizationsApi.list({ page, size, search: search || undefined });
			organizations = res.data;
			total = res.total;
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function handleCreated(newOrg: OrganizationSelect) {
		organizations = [newOrg, ...organizations];
		if (organizations.length > size) organizations.pop();
		total += 1;
	}

	$effect(() => {
		loadOrgs();
		page;
		size;
		search;
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Organizations</h1>
			<p class="text-muted-foreground">Manage workspaces.</p>
		</div>
		<OrganizationCreate onCreated={handleCreated} />
	</div>

	<Card.Root>
		<Card.Header class="pb-2">
			<ListToolbar bind:search bind:size bind:page placeholder="Search orgs..." />
		</Card.Header>

		<Card.Content>
			<DataTable {loading} data={organizations} {columns}>
				{#snippet row(org: OrganizationSelect)}
					<Table.Row>
						<Table.Cell>
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/50">
									<Building2 class="h-4 w-4 text-muted-foreground" />
								</div>
								<div class="flex flex-col">
									<span class="font-medium">{org.name}</span>
									<span class="text-xs text-muted-foreground truncate max-w-50">ID: {org.id}</span>
								</div>
							</div>
						</Table.Cell>

						<Table.Cell>
							<Badge variant="outline" class="font-mono">{org.code || '-'}</Badge>
						</Table.Cell>

						<Table.Cell>
							<div class="flex items-center text-sm text-muted-foreground">
								<Globe class="mr-2 h-3.5 w-3.5 opacity-70" />
								{org.timezone}
							</div>
						</Table.Cell>

						<Table.Cell>
							<div class="flex items-center text-sm text-muted-foreground">
								<Banknote class="mr-2 h-3.5 w-3.5 opacity-70" />
								{org.currency}
							</div>
						</Table.Cell>

						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="ghost" size="icon" class="h-8 w-8">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(org.id)}>
										Copy ID
									</DropdownMenu.Item>
									<DropdownMenu.Item class="text-destructive">Archive</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/snippet}
			</DataTable>
		</Card.Content>

		<Card.Footer>
			<div class="w-full">
				<ListPagination bind:page {size} {total} {loading} />
			</div>
		</Card.Footer>
	</Card.Root>
</div>
