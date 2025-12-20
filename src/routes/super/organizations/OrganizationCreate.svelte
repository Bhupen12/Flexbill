<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import type { OrganizationSelect } from '$lib/types';
	import { AsyncRequest } from '$lib/utils/asyncHandler.svelte';

	let { onCreated } = $props<{
		onCreated: (org: OrganizationSelect) => void;
	}>();

	let open = $state(false);

	// Initial state for easy reset
	const initialOrg = {
		name: '',
		code: '',
		timezone: 'Asia/Kolkata',
		currency: 'INR'
	};

	let newOrg = $state({ ...initialOrg });

	const orgRequest = new AsyncRequest<OrganizationSelect>();
	async function createOrganization() {
		if (!newOrg.name || !newOrg.code) return; // Basic validation

		await orgRequest.call(organizationsApi.create(newOrg), {
			onSuccess: (res) => {
				onCreated(res);
				newOrg = { ...initialOrg };
				open = false;
			},
			showToast: true
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>Create Organization</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-125">
		<Dialog.Header>
			<Dialog.Title>Create Organization</Dialog.Title>
			<Dialog.Description>Set up a new organization workspace.</Dialog.Description>
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
			<Button variant="outline" onclick={() => (open = false)} disabled={orgRequest.loading}
				>Cancel</Button
			>
			<Button disabled={orgRequest.loading} onclick={createOrganization}>
				{#if orgRequest.loading}
					<Spinner />
				{/if}
				{orgRequest.loading ? 'Creating...' : 'Create Organization'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
