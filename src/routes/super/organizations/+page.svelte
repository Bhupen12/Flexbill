<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import type { OrganizationSelect } from '$lib/types';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';

	// ===== list state =====
	let organizations = $state<OrganizationSelect[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);

	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	const totalPages = $derived(Math.ceil(total / size));

	// ===== create organization state =====
	let openCreate = $state(false);
	let creating = $state(false);

	// Default structure for new organization
	let newOrg = $state({
		name: '',
		code: '',
		timezone: 'UTC', // Default value
		currency: 'USD' // Default value
	});

	async function loadOrganizations() {
		loading = true;
		try {
			const res = await organizationsApi.list({
				page,
				size,
				search: search || undefined
			});

			organizations = res.data;
			total = res.total;
		} catch (e) {
			error = 'Failed to load organizations';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	async function createOrganization() {
		creating = true;
		try {
			const newOrgData = (await organizationsApi.create(newOrg)) as OrganizationSelect;
			openCreate = false;

			organizations = [newOrgData, ...organizations];
			total += 1;
			newOrg = { name: '', code: '', timezone: 'UTC', currency: 'USD' };
		} catch (e) {
			console.error('Failed to create organization', e);
		} finally {
			creating = false;
		}
	}

	$effect(() => {
		page;
		size;
		search;
		loadOrganizations();
	});
</script>

<div class="p-6 space-y-4">
	<div class="flex justify-between items-center">
		<h1 class="text-xl font-semibold">Organizations</h1>

		<Dialog.Root bind:open={openCreate}>
			<Dialog.Trigger>
				<Button>Create Organization</Button>
			</Dialog.Trigger>

			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Create Organization</Dialog.Title>
				</Dialog.Header>

				<div class="space-y-4">
					<div>
						<Label>Name</Label>
						<Input bind:value={newOrg.name} placeholder="Acme Corp" />
					</div>

					<div>
						<Label>Code</Label>
						<Input bind:value={newOrg.code} placeholder="ACM01" />
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label>Timezone</Label>
							<Input bind:value={newOrg.timezone} placeholder="Asia/Kolkata" />
						</div>

						<div>
							<Label>Currency</Label>
							<Input bind:value={newOrg.currency} placeholder="INR" />
						</div>
					</div>
				</div>

				<Dialog.Footer>
					<Button disabled={creating} onclick={createOrganization}>
						{creating ? 'Creating…' : 'Create'}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<div class="flex gap-3">
		<Input placeholder="Search organizations" bind:value={search} class="max-w-sm" />

		<select bind:value={size} class="border rounded px-2 py-2">
			<option value={10}>10</option>
			<option value={20}>20</option>
			<option value={50}>50</option>
		</select>
	</div>

	{#if loading}
		<div class="p-8 text-center text-muted-foreground">Loading organizations…</div>
	{:else}
		<div class="border rounded">
			<table class="w-full">
				<thead class="bg-muted">
					<tr>
						<th class="text-left p-2">Name</th>
						<th class="text-left p-2">Code</th>
						<th class="text-left p-2">Timezone</th>
						<th class="text-left p-2">Currency</th>
						<th class="text-left p-2">Action</th>
					</tr>
				</thead>

				<tbody>
					{#each organizations as org}
						<tr class="border-t hover:bg-muted/50">
							<td class="p-2 font-medium">{org.name}</td>
							<td class="p-2">
								{#if org.code}
									<span class="bg-slate-100 px-2 py-0.5 rounded text-xs border">
										{org.code}
									</span>
								{:else}
									<span class="text-muted-foreground text-sm">-</span>
								{/if}
							</td>
							<td class="p-2">{org.timezone}</td>
							<td class="p-2">{org.currency}</td>
							<td class="p-2">
								<a href={`/super/organizations/${org.id}`} class="text-primary underline text-sm">
									View
								</a>
							</td>
						</tr>
					{/each}

					{#if organizations.length === 0}
						<tr>
							<td colspan="5" class="text-center p-6 text-muted-foreground">
								No organizations found
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	{/if}

	<div class="flex items-center gap-3">
		<Button variant="outline" disabled={page === 1} onclick={() => page--}>Prev</Button>

		<span class="text-sm text-muted-foreground">
			Page {page} of {totalPages || 1}
		</span>

		<Button variant="outline" disabled={page >= totalPages} onclick={() => page++}>Next</Button>
	</div>
</div>
