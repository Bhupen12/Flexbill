<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { organizationsApi, usersApi } from '$lib/api';
	import { isSuperAdmin, user } from '$lib/stores/user';
	import { type OrganizationSelect, type UserSelectType } from '$lib/types';
	import { cn } from '$lib/utils';
	import { Check, ChevronsUpDown, Eye, EyeOff } from '@lucide/svelte';
	import DebouncedInput from '../DebouncedInput.svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	// Props
	let { onCreated } = $props<{
		onCreated: (user: UserSelectType) => void;
	}>();

	let open = $state(false);
	let creating = $state(false);
	let showPassword = $state(false);

	// --- Org Search State ---
	let orgOpen = $state(false);
	let orgSearch = $state('');
	let orgOptions = $state<OrganizationSelect[]>([]);
	let orgLoading = $state(false);

	const initialUser = {
		email: '',
		password: '',
		full_name: '',
		phone: '',
		role: 'user' as const,
		organization_id: $user?.organization_id
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
		if (!$isSuperAdmin) return;
		orgLoading = true;
		try {
			const res = await organizationsApi.list({ page: 1, size: 5, search: query });
			orgOptions = res.data;
		} catch (e) {
			console.error(e);
			toast.error('Failed to load organizations');
		} finally {
			orgLoading = false;
		}
	}

	$effect(() => {
		if (orgOpen && $isSuperAdmin) {
			searchOrganizations(orgSearch);
		}
	});

	$effect(() => {
		if (!open) {
			setTimeout(() => {
				newUser = { ...initialUser, organization_id: $user?.organization_id };
				showPassword = false;
			}, 200);
		} else {
			if (!$isSuperAdmin && $user?.organization_id) {
				newUser.organization_id = $user.organization_id;
			}
		}
	});

	async function createUser() {
		if (!newUser.email || !newUser.password || !newUser.organization_id) {
			toast.warning('Please fill all required fields');
			return;
		}

		creating = true;
		try {
			const newUserData = (await usersApi.create(newUser)) as UserSelectType;

			toast.success(`User ${newUserData.full_name || 'Created'} successfully!`);

			onCreated(newUserData);
			open = false;
		} catch (e: any) {
			console.error('Failed to create user', e);
			const errorMessage =
				e?.body?.message || e?.message || 'Failed to create user. Please try again.';
			toast.error(errorMessage);
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
			<Dialog.Description>Fill in the details to invite a new user.</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-6 py-4">
			{#if $isSuperAdmin}
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
									{newUser.organization_id ? selectedOrgName : 'Select organization...'}
									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-115 p-0" align="start">
							<Command.Root shouldFilter={false}>
								<div class="border-b border-border px-1 py-1">
									<DebouncedInput
										placeholder="Search organization..."
										bind:value={orgSearch}
										debounce={500}
										class="w-full max-w-none" 
										inputClass="border-none shadow-none focus-visible:ring-0 h-9"
									/>
								</div>
								<Command.List>
									{#if orgLoading}
										<div class="p-4 text-center text-sm text-muted-foreground">Loading...</div>
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
			{/if}

			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label>Full Name</Label>
						<Input bind:value={newUser.full_name} placeholder="e.g. John Doe" />
					</div>
					<div class="grid gap-2">
						<Label>Role</Label>
						<Select.Root type="single" bind:value={newUser.role}>
							<Select.Trigger class="w-full">Select a role</Select.Trigger>
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
						<Label>Email Address</Label>
						<Input type="email" bind:value={newUser.email} placeholder="name@company.com" />
					</div>
					<div class="grid gap-2">
						<Label>Phone Number</Label>
						<Input bind:value={newUser.phone} placeholder="+91..." />
					</div>
				</div>

				<div class="grid gap-2">
					<Label>Password</Label>
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							bind:value={newUser.password}
							class="pr-10"
						/>
						<Button
							variant="ghost"
							size="icon"
							class="absolute right-0 top-0 h-full px-3 py-2"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4 text-muted-foreground" />
							{:else}
								<Eye class="h-4 w-4 text-muted-foreground" />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={creating}>Cancel</Button>
			<Button disabled={creating} onclick={createUser}>
				{#if creating}
					<Spinner />
				{/if}
				Create User
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
