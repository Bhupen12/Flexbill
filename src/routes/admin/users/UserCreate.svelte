<script lang="ts">
	import { usersApi } from '$lib/api';
	import type { UserSelectType } from '$lib/types';
	import { Eye, EyeOff, Loader2 } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { user } from '$lib/stores/user';

	let { onCreated } = $props<{
		onCreated: (user: UserSelectType) => void;
	}>();

	let open = $state(false);
	let creating = $state(false);
	let showPassword = $state(false); // Toggle state for password visibility

	// Initial state
	const initialUser = {
		email: '',
		password: '', // New field
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
								Select a role
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
