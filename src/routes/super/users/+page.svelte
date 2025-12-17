<script lang="ts">
	import { usersApi } from '$lib/api';
	import UserCreateDialog from '$lib/components/custom/domains/users/UserCreateDialog.svelte';
	import DataTable from '$lib/components/custom/shared-table/DataTable.svelte';
	import ListPagination from '$lib/components/custom/shared-table/ListPagination.svelte';
	import ListToolbar from '$lib/components/custom/shared-table/ListToolbar.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { ROLES, type UserSelectType } from '$lib/types';
	import { MoreHorizontal } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	// State
	let users = $state<UserSelectType[]>([]);
	let loading = $state(false);
	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	// Table Columns Definition
	const columns = [
		{ label: 'ID', class: 'w-25' },
		{ label: 'User Info' },
		{ label: 'Phone' },
		{ label: 'Role' },
		{ label: 'Actions', class: 'text-right' }
	];

	async function loadUsers() {
		loading = true;
		try {
			const res = await usersApi.list({
				page,
				size,
				search: search || undefined
			});
			users = res.data;
			total = res.total;
		} catch (e) {
			console.error(e);
			toast.error("Unable to load users list");
		} finally {
			loading = false;
		}
	}

	function handleUserCreated(newUserData: UserSelectType) {
		users = [newUserData, ...users];
		if (users.length > size) users.pop();
		total += 1;
	}

	$effect(() => {
		loadUsers();
		page;
		size;
		search;
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">All Users</h1>
			<p class="text-muted-foreground">Manage users across all organizations.</p>
		</div>
		<UserCreateDialog onCreated={handleUserCreated} />
	</div>

	<Card.Root>
		<Card.Header class="pb-2">
			<ListToolbar bind:search bind:size bind:page placeholder="Search by name, email or org..." />
		</Card.Header>

		<Card.Content>
			<DataTable {loading} data={users} {columns}>
				{#snippet row(user: UserSelectType)}
					<Table.Row>
						<Table.Cell class="font-mono text-xs text-muted-foreground">
							#{user.id.substring(0, 6)}
						</Table.Cell>

						<Table.Cell>
							<div class="flex flex-col">
								<span class="font-medium">{user.full_name || 'Unknown'}</span>
								<span class="text-xs text-muted-foreground">{user.email}</span>
								{#if user.organization_id}
									<span class="text-[10px] text-blue-500"
										>Org: {user.organization_id.substring(0, 8)}...</span
									>
								{/if}
							</div>
						</Table.Cell>

						<Table.Cell>{user.phone || '-'}</Table.Cell>

						<Table.Cell>
							<Badge
								variant={user.role === ROLES.ADMIN
									? 'default'
									: user.role === ROLES.SUPER_ADMIN
										? 'destructive'
										: 'secondary'}
							>
								{user.role}
							</Badge>
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
									<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(user.id)}>
										Copy User ID
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onclick={() => navigator.clipboard.writeText(user.organization_id || '')}
									>
										Copy Org ID
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item class="text-destructive">Delete User</DropdownMenu.Item>
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
