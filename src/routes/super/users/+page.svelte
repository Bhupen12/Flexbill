<script lang="ts">
	import { usersApi } from '$lib/api';
	import type { UserSelectType, UserInsertType } from '$lib/types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';

	// ===== list state =====
	let users = $state<UserSelectType[]>([]);
	let loading = $state(false);
	let error= $state<string | null>(null);

	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	const totalPages = $derived(Math.ceil(total / size));

	// ===== create user state =====
	let openCreate = $state(false);
	let creating = $state(false);

	let newUser: UserInsertType = $state({
		full_name: '',
		email: '',
		role: 'user'
	});

	async function loadUsers() {
		loading = true;
		try {
			debugger
			const res = await usersApi.list({
				page,
				size,
				search: search || undefined
			});

			users = res.data;
			total = res.total;
		} catch {
			error = 'Failed to load users';
		} finally {
			loading = false;
		}
	}

	async function createUser() {
		creating = true;
		try {
			await usersApi.create(newUser);
			openCreate = false;
			page = 1;
			await loadUsers();

			// reset
			newUser = { full_name: '', email: '', role: 'user' };
		} finally {
			creating = false;
		}
	}

	$effect(() => {
		page;
		size;
		search;
		loadUsers();
	});
</script>

<div class="p-6 space-y-4">
	<!-- header -->
	<div class="flex justify-between items-center">
		<h1 class="text-xl font-semibold">Users</h1>

		<Dialog.Root bind:open={openCreate}>
			<Dialog.Trigger>
				<Button>Create User</Button>
			</Dialog.Trigger>

			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Create User</Dialog.Title>
				</Dialog.Header>

				<div class="space-y-4">
					<div>
						<Label>Name</Label>
						<Input bind:value={newUser.full_name} />
					</div>

					<div>
						<Label>Email</Label>
						<Input bind:value={newUser.email} type="email" />
					</div>

					<div>
						<Label>Role</Label>
						<select bind:value={newUser.role} class="w-full border rounded px-2 py-2">
							<option value="USER">User</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>
				</div>

				<Dialog.Footer>
					<Button disabled={creating} onclick={createUser}>
						{creating ? 'Creating…' : 'Create'}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<!-- filters -->
	<div class="flex gap-3">
		<Input placeholder="Search users" bind:value={search} class="max-w-sm" />

		<select bind:value={size} class="border rounded px-2 py-2">
			<option value={10}>10</option>
			<option value={20}>20</option>
			<option value={50}>50</option>
		</select>
	</div>

	<!-- table -->
	{#if loading}
		<p>Loading…</p>
	{:else}
		<div class="border rounded">
			<table class="w-full">
				<thead class="bg-muted">
					<tr>
						<th class="text-left p-2">Name</th>
						<th class="text-left p-2">Email</th>
						<th class="text-left p-2">Role</th>
						<th class="text-left p-2">Action</th>
					</tr>
				</thead>

				<tbody>
					{#each users as user}
						<tr class="border-t">
							<td class="p-2">{user.full_name}</td>
							<td class="p-2">{user.email}</td>
							<td class="p-2">{user.role}</td>
							<td class="p-2">
								<a href={`/super/users/${user.id}`} class="text-primary underline"> View </a>
							</td>
						</tr>
					{/each}

					{#if users.length === 0}
						<tr>
							<td colspan="4" class="text-center p-6 text-muted-foreground"> No users found </td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- pagination -->
	<div class="flex items-center gap-3">
		<Button variant="outline" disabled={page === 1} onclick={() => page--}>Prev</Button>

		<span class="text-sm">
			Page {page} of {totalPages}
		</span>

		<Button variant="outline" disabled={page === totalPages} onclick={() => page++}>Next</Button>
	</div>
</div>
