<script lang="ts">
	import { usersApi } from '$lib/api';
	import { ROLES, type UserSelectType } from '$lib/types';
	import UserCreate from './UserCreate.svelte';

	// UI Components
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	// Icons
	import { Search, MoreHorizontal, ChevronLeft, ChevronRight, UserX, Loader2 } from '@lucide/svelte';

	let users = $state<UserSelectType[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Pagination state
	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	const totalPages = $derived(Math.ceil(total / size));

	// Display text for pagination info
	const startRecord = $derived((page - 1) * size + 1);
	const endRecord = $derived(Math.min(page * size, total));

	const pageSizes = [
		{ value: '10', label: '10 rows' },
		{ value: '20', label: '20 rows' },
		{ value: '50', label: '50 rows' }
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
			error = 'Failed to load users';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function handleUserCreated(newUserData: UserSelectType) {
		// Add to top and update total locally to avoid refetch
		users = [newUserData, ...users];
		if (users.length > size) users.pop(); // Keep page size consistent
		total += 1;
	}

	// Effect handles fetching when deps change
	$effect(() => {
		// Note: Production mein yahan debounce lagana mat bhoolna search ke liye
		loadUsers();
		// Reactive dependencies:
		page;
		size;
		search;
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Users</h1>
			<p class="text-muted-foreground">
				Manage your team members and their account permissions here.
			</p>
		</div>
		<UserCreate onCreated={handleUserCreated} />
	</div>

	<Card.Root>
		<Card.Header class="pb-2">
			<div class="flex items-center justify-between gap-4">
				<div class="relative w-full max-w-sm">
					<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search by name or email..."
						class="pl-9"
						bind:value={search}
					/>
				</div>

				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
					<Select.Root
						type="single"
						value={String(size)}
						onValueChange={(v) => {
							size = Number(v);
							page = 1;
						}}
					>
						<Select.Trigger class="w-25">
							{pageSizes.find((p) => p.value === String(size))?.label}
						</Select.Trigger>
						<Select.Content>
							{#each pageSizes as ps}
								<Select.Item value={ps.value}>{ps.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</Card.Header>

		<Card.Content>
			<div class="rounded-md border">
				<Table.Root>
					<Table.Header>
						<Table.Row class="bg-muted/50">
							<Table.Head class="w-25">ID</Table.Head>
							<Table.Head>User Info</Table.Head>
							<Table.Head>Phone</Table.Head>
							<Table.Head>Role</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#if loading}
							<Table.Row>
								<Table.Cell colspan={5} class="h-24 text-center">
									<div class="flex items-center justify-center text-muted-foreground">
										<Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading users...
									</div>
								</Table.Cell>
							</Table.Row>
						{:else if users.length === 0}
							<Table.Row>
								<Table.Cell colspan={5} class="h-75 text-center">
									<div
										class="flex flex-col items-center justify-center text-muted-foreground gap-2"
									>
										<UserX class="h-10 w-10 opacity-20" />
										<p>No users found matching your search.</p>
									</div>
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each users as user (user.id)}
								<Table.Row>
									<Table.Cell class="font-mono text-xs text-muted-foreground">
										#{user.id.substring(0, 6)}
									</Table.Cell>

									<Table.Cell>
										<div class="flex flex-col">
											<span class="font-medium">{user.full_name || 'Unknown User'}</span>
											<span class="text-xs text-muted-foreground">{user.email}</span>
										</div>
									</Table.Cell>

									<Table.Cell>
										{user.phone || '-'}
									</Table.Cell>

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
														<span class="sr-only">Open menu</span>
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end">
												<DropdownMenu.Label>Actions</DropdownMenu.Label>
												<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(user.id)}>
													Copy ID
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												<DropdownMenu.Item>
													View Details
												</DropdownMenu.Item>
												<DropdownMenu.Item class="text-destructive">Delete User</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>

		<Card.Footer class="flex items-center justify-between py-4">
			<div class="text-xs text-muted-foreground">
				Showing <strong>{startRecord}-{endRecord}</strong> of <strong>{total}</strong> users
			</div>

			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" disabled={page === 1 || loading} onclick={() => page--}>
					<ChevronLeft class="h-4 w-4 mr-1" /> Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={page >= totalPages || loading}
					onclick={() => page++}
				>
					Next <ChevronRight class="h-4 w-4 ml-1" />
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
