<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import type { OrganizationSelect } from '$lib/types';
	import { Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { onCreated } = $props<{
		onCreated: (org: OrganizationSelect) => void;
	}>();

	let open = $state(false);
	let creating = $state(false);

	// Initial state for easy reset
	const initialOrg = {
		name: '',
		code: '',
		timezone: 'Asia/Kolkata', // Smart default
		currency: 'INR' // Smart default
	};

	let newOrg = $state({ ...initialOrg });

	async function createOrganization() {
		if (!newOrg.name || !newOrg.code) return; // Basic validation

		creating = true;
		try {
			const newOrgData = (await organizationsApi.create(newOrg)) as OrganizationSelect;
			onCreated(newOrgData);

			open = false;
			newOrg = { ...initialOrg }; // Clean reset
		} catch (e) {
			console.error('Failed to create organization', e);
		} finally {
			creating = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>Create Organization</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-125">
		<Dialog.Header>
			<Dialog.Title>Create Organization</Dialog.Title>
			<Dialog.Description>
				Set up a new organization workspace.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-6 py-4">
			<div class="grid gap-2">
				<Label class="text-foreground/80">Organization Name</Label>
				<Input bind:value={newOrg.name} placeholder="e.g. Acme Corp Industries" autofocus />
			</div>

			<div class="grid gap-2">
				<Label class="text-foreground/80">Organization Code</Label>
				<Input bind:value={newOrg.code} placeholder="e.g. ACME-HO-01" class="uppercase" />
				<p class="text-[0.8rem] text-muted-foreground">
					Unique identifier used for URLs and references.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label class="text-foreground/80">Timezone</Label>
					<Input bind:value={newOrg.timezone} placeholder="Asia/Kolkata" />
				</div>

				<div class="grid gap-2">
					<Label class="text-foreground/80">Currency</Label>
					<Input bind:value={newOrg.currency} placeholder="INR" />
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={creating}>Cancel</Button>
			<Button disabled={creating} onclick={createOrganization}>
				{#if creating}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{creating ? 'Creating...' : 'Create Organization'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
