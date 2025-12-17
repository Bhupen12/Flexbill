<script lang="ts">
	import { usersApi, organizationsApi } from '$lib/api';
	import type { UserSelectType, OrganizationSelect } from '$lib/types';
	// Added Eye and EyeOff icons
	import { Check, ChevronsUpDown, Loader2, Eye, EyeOff } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	let { onCreated } = $props<{
		onCreated: (user: UserSelectType) => void;
	}>();

	let open = $state(false);
	let creating = $state(false);
	let showPassword = $state(false); // Toggle state for password visibility

	// Organization Search State
	let orgOpen = $state(false);
	let orgSearch = $state('');
	let orgOptions = $state<OrganizationSelect[]>([]);
	let orgLoading = $state(false);

	// Initial state
	const initialUser = {
		email: '',
		password: '', // New field
		full_name: '',
		phone: '',
		role: 'user' as const,
		organization_id: ''
	};

	let newUser = $state({ ...initialUser });

	const roles = [
		{ value: 'user', label: 'User' },
		{ value: 'admin', label: 'Admin' }
	];

	const selectedOrgName = $derived(
		orgOptions.find((o) => o.id === newUser.organization_id)?.name ?? 'Select Organization'
	);

	async function searchOrganizations(query: string) {
		orgLoading = true;
		try {
			const res = await organizationsApi.list({
				page: 1,
				size: 5,
				search: query
			});
			orgOptions = res.data;
		} catch (e) {
			console.error('Failed to search organizations', e);
		} finally {
			orgLoading = false;
		}
	}

	$effect(() => {
		if (orgOpen) {
			searchOrganizations(orgSearch);
		}
	});

	async function createUser() {
		// Basic validation
		if (!newUser.email || !newUser.organization_id || !newUser.password) return;

		creating = true;
		try {
			const newUserData = (await usersApi.create(newUser)) as UserSelectType;
			onCreated(newUserData);
			open = false;
			newUser = { ...initialUser };
			showPassword = false; // Reset visibility
		} catch (e) {
			console.error('Failed to create user', e);
		} finally {
			creating = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>Create User</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-125">
		<Dialog.Header>
			<Dialog.Title>Add New User</Dialog.Title>
			<Dialog.Description>
				Fill in the details to invite a new user to the system.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-6 py-4">
			<div class="grid gap-2">
				<Label class="text-foreground/80">Organization</Label>
				<Popover.Root bind:open={orgOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={orgOpen}
								class="w-full justify-between bg-muted/50 font-normal"
								{...props}
							>
								{newUser.organization_id
									? (orgOptions.find((o) => o.id === newUser.organization_id)?.name ??
										selectedOrgName)
									: 'Select organization...'}
								<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-115 p-0" align="start">
						<Command.Root shouldFilter={false}>
							<Command.Input placeholder="Search organization..." bind:value={orgSearch} />
							<Command.List>
								{#if orgLoading}
									<div class="flex items-center justify-center py-6 text-sm text-muted-foreground">
										<Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading...
									</div>
								{:else if orgOptions.length === 0}
									<Command.Empty>No organization found.</Command.Empty>
								{:else}
									<Command.Group>
										{#each orgOptions as org (org.id)}
											<Command.Item
												value={org.name}
												onSelect={() => {
													newUser.organization_id = org.id;
													orgOpen = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														newUser.organization_id === org.id ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{org.name}
											</Command.Item>
										{/each}
									</Command.Group>
								{/if}
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>

			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label class="text-foreground/80">Full Name</Label>
						<Input bind:value={newUser.full_name} placeholder="e.g. John Doe" />
					</div>
					<div class="grid gap-2">
						<Label class="text-foreground/80">Role</Label>
						<Select.Root type="single" bind:value={newUser.role}>
							<Select.Trigger class="w-full">
								"Select a role
							</Select.Trigger>
							<Select.Content>
								{#each roles as role}
									<Select.Item value={role.value}>{role.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label class="text-foreground/80">Email Address</Label>
						<Input type="email" bind:value={newUser.email} placeholder="name@company.com" />
					</div>
					<div class="grid gap-2">
						<Label class="text-foreground/80">Phone Number</Label>
						<Input bind:value={newUser.phone} placeholder="+91..." />
					</div>
				</div>

				<div class="grid gap-2">
					<Label class="text-foreground/80">Password</Label>
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							bind:value={newUser.password}
							placeholder="Create a strong password"
							class="pr-10"
						/>
						<Button
							variant="ghost"
							size="icon"
							class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4 text-muted-foreground" />
							{:else}
								<Eye class="h-4 w-4 text-muted-foreground" />
							{/if}
							<span class="sr-only">
								{showPassword ? 'Hide password' : 'Show password'}
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={creating}>Cancel</Button>
			<Button disabled={creating} onclick={createUser}>
				{#if creating}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{creating ? 'Creating...' : 'Create User'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
