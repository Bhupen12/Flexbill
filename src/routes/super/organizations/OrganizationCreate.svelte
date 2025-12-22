<script lang="ts">
	import { organizationsApi } from '$lib/api';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Field from '$lib/components/ui/field';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import type { OrganizationSelect } from '$lib/types';
	import { AsyncRequest } from '$lib/utils/asyncHandler.svelte';
	import { Building2, Hash, Globe, Banknote } from '@lucide/svelte';

	let { onCreated } = $props<{
		onCreated: (org: OrganizationSelect) => void;
	}>();

	let open = $state(false);

	const initialOrg = {
		name: '',
		code: '',
		timezone: 'Asia/Kolkata',
		currency: 'INR'
	};

	let newOrg = $state({ ...initialOrg });

	const orgRequest = new AsyncRequest<OrganizationSelect>();
	
	async function createOrganization() {
		if (!newOrg.name || !newOrg.code) return; 

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

		<div class="py-4">
			<Field.Group>
				
				<Field.Set>
					<Field.Legend>Basic Details</Field.Legend>
					<Field.Group class="grid gap-4">
						<Field.Field>
							<Field.Label class="text-foreground/80">Organization Name</Field.Label>
							<InputGroup.Root>
								<InputGroup.Addon>
									<Building2 class="size-4" />
								</InputGroup.Addon>
								<InputGroup.Input 
									bind:value={newOrg.name} 
									placeholder="e.g. Acme Corp Industries" 
									autofocus 
								/>
							</InputGroup.Root>
						</Field.Field>

						<Field.Field>
							<Field.Label class="text-foreground/80">Organization Code</Field.Label>
							<InputGroup.Root>
								<InputGroup.Addon>
									<Hash class="size-4" />
								</InputGroup.Addon>
								<InputGroup.Input 
									bind:value={newOrg.code} 
									placeholder="e.g. ACME-HO-01" 
									class="uppercase" 
								/>
							</InputGroup.Root>
							<Field.Description>
								Unique identifier used for URLs.
							</Field.Description>
						</Field.Field>
					</Field.Group>
				</Field.Set>

				<Field.Separator />

				<Field.Set>
					<Field.Legend>Regional Settings</Field.Legend>
					<Field.Group class="grid grid-cols-2 gap-4">
						<Field.Field>
							<Field.Label class="text-foreground/80">Timezone</Field.Label>
							<InputGroup.Root>
								<InputGroup.Addon>
									<Globe class="size-4" />
								</InputGroup.Addon>
								<InputGroup.Input 
									bind:value={newOrg.timezone} 
									placeholder="Asia/Kolkata" 
								/>
							</InputGroup.Root>
						</Field.Field>

						<Field.Field>
							<Field.Label class="text-foreground/80">Currency</Field.Label>
							<InputGroup.Root>
								<InputGroup.Addon>
									<Banknote class="size-4" />
								</InputGroup.Addon>
								<InputGroup.Input 
									bind:value={newOrg.currency} 
									placeholder="INR" 
								/>
							</InputGroup.Root>
						</Field.Field>
					</Field.Group>
				</Field.Set>

			</Field.Group>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={orgRequest.loading}>
				Cancel
			</Button>
			<Button disabled={orgRequest.loading} onclick={createOrganization}>
				{#if orgRequest.loading}
					<Spinner class="mr-2 h-4 w-4" />
				{/if}
				{orgRequest.loading ? 'Creating...' : 'Create Organization'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>