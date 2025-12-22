<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { organizationsApi, usersApi } from '$lib/api';
	import { isSuperAdmin, user } from '$lib/stores/user.svelte';
	import { type OrganizationSelect, type UserSelectType } from '$lib/types';
	import { cn } from '$lib/utils';
	import DebouncedInput from '../DebouncedInput.svelte';

	// UI Components
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Field from '$lib/components/ui/field';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	// Icons
	import {
		Check,
		ChevronsUpDown,
		Eye,
		EyeOff,
		Building2,
		User,
		Mail,
		Phone,
		Lock,
		Shield
	} from '@lucide/svelte';

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

	<Dialog.Content class="sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Add New User</Dialog.Title>
			<Dialog.Description>Configure access and user details.</Dialog.Description>
		</Dialog.Header>

		<div class="py-4">
			<Field.Group>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					
					<Field.Set>
						<Field.Legend>Access & Credentials</Field.Legend>
						<div class="grid gap-4">
							
							{#if $isSuperAdmin}
								<Field.Field>
									<Field.Label>Organization</Field.Label>
									<div class="relative">
										<Popover.Root bind:open={orgOpen}>
											<Popover.Trigger>
												{#snippet child({ props })}
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={orgOpen}
														class="w-full justify-between bg-background px-3 font-normal"
														{...props}
													>
														<div class="flex items-center gap-2">
															<Building2 class="text-muted-foreground size-4" />
															<span class="truncate">
																{newUser.organization_id
																	? selectedOrgName
																	: 'Select organization...'}
															</span>
														</div>
														<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												{/snippet}
											</Popover.Trigger>
											<Popover.Content class="w-80 p-0" align="start">
												<Command.Root shouldFilter={false}>
													<div class="border-border border-b px-1 py-1">
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
															<div class="text-muted-foreground p-4 text-center text-sm">
																Loading...
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
																				newUser.organization_id === org.id
																					? 'opacity-100'
																					: 'opacity-0'
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
								</Field.Field>
							{/if}

							<Field.Field>
								<Field.Label>Role</Field.Label>
								<Select.Root type="single" bind:value={newUser.role}>
									<Select.Trigger class="w-full pl-3">
										<div class="flex items-center gap-2">
											<Shield class="text-muted-foreground size-4" />
											<span>
												{roles.find((r) => r.value === newUser.role)?.label ??
													'Select Role'}
											</span>
										</div>
									</Select.Trigger>
									<Select.Content>
										{#each roles as role}
											<Select.Item value={role.value}>{role.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</Field.Field>

							<Field.Field>
								<Field.Label>Password</Field.Label>
								<InputGroup.Root>
									<InputGroup.Addon>
										<Lock class="size-4" />
									</InputGroup.Addon>
									<InputGroup.Input
										type={showPassword ? 'text' : 'password'}
										bind:value={newUser.password}
										placeholder="••••••••"
									/>
									<InputGroup.Addon>
										<InputGroup.Button
											variant="ghost"
											size="icon-xs"
											onclick={() => (showPassword = !showPassword)}
										>
											{#if showPassword}
												<EyeOff class="h-4 w-4" />
											{:else}
												<Eye class="h-4 w-4" />
											{/if}
										</InputGroup.Button>
									</InputGroup.Addon>
								</InputGroup.Root>
							</Field.Field>

						</div>
					</Field.Set>

					<Field.Set>
						<Field.Legend>Personal Details</Field.Legend>
						<div class="grid gap-4">
							<Field.Field>
								<Field.Label>Full Name</Field.Label>
								<InputGroup.Root>
									<InputGroup.Addon>
										<User class="size-4" />
									</InputGroup.Addon>
									<InputGroup.Input
										bind:value={newUser.full_name}
										placeholder="e.g. John Doe"
									/>
								</InputGroup.Root>
							</Field.Field>

							<Field.Field>
								<Field.Label>Email Address</Field.Label>
								<InputGroup.Root>
									<InputGroup.Addon>
										<Mail class="size-4" />
									</InputGroup.Addon>
									<InputGroup.Input
										type="email"
										bind:value={newUser.email}
										placeholder="name@company.com"
									/>
								</InputGroup.Root>
							</Field.Field>

							<Field.Field>
								<Field.Label>Phone Number</Field.Label>
								<InputGroup.Root>
									<InputGroup.Addon>
										<Phone class="size-4" />
									</InputGroup.Addon>
									<InputGroup.Input
										bind:value={newUser.phone}
										placeholder="+91..."
									/>
								</InputGroup.Root>
							</Field.Field>
						</div>
					</Field.Set>

				</div>
			</Field.Group>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={creating}>
				Cancel
			</Button>
			<Button disabled={creating} onclick={createUser}>
				{#if creating}
					<Spinner class="mr-2 h-4 w-4" />
				{/if}
				Create User
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>