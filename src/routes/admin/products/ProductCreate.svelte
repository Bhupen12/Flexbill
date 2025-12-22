<script lang="ts">
	import { productsApi } from '$lib/api';
	import type { ProductSelectType } from '$lib/types';
// UI Components
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { user } from '$lib/stores/user.svelte';
	import { AsyncRequest } from '$lib/utils/asyncHandler.svelte';

	// Props
	let { onCreated } = $props<{
		onCreated: (product: ProductSelectType) => void;
	}>();

	let open = $state(false);

	// Initial State
	const initialProduct = {
		name: '',
		sku: '',
		description: '',
		unit: 'pcs',
		tax_percent: '0',
		organization_id: $user?.organization_id as string,
		is_active: true
	};

	let newProduct = $state({ ...initialProduct });

	const productRequest = new AsyncRequest<ProductSelectType>();
	async function createProduct() {
		if (!newProduct.name) return;

		newProduct.tax_percent = newProduct.tax_percent.toString();
		await productRequest.call(productsApi.create(newProduct), {
			onSuccess: (res) => {
				onCreated(res);
				newProduct = { ...initialProduct };
				open = false;
			},
			showToast: true
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>Add Product</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-125">
		<Dialog.Header>
			<Dialog.Title>Add New Product</Dialog.Title>
			<Dialog.Description>
				Create a new product or service item for your inventory.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-6 py-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label class="text-foreground/80">Product Name</Label>
					<Input bind:value={newProduct.name} placeholder="e.g. Wireless Mouse" autofocus />
				</div>
				<div class="grid gap-2">
					<Label class="text-foreground/80">SKU / Code</Label>
					<Input bind:value={newProduct.sku} placeholder="e.g. WM-001" class="uppercase" />
				</div>
			</div>

			<div class="grid gap-2">
				<Label class="text-foreground/80">Description</Label>
				<Textarea
					bind:value={newProduct.description}
					placeholder="Enter product details..."
					class="resize-none h-20"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label class="text-foreground/80">Unit</Label>
					<Input bind:value={newProduct.unit} placeholder="e.g. pcs, kg, box" />
				</div>
				<div class="grid gap-2">
					<Label class="text-foreground/80">Tax (%)</Label>
					<div class="relative">
						<Input
							type="number"
							bind:value={newProduct.tax_percent}
							placeholder="0"
							min="0"
							step="0.01"
							class="pr-8"
						/>
						<span class="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)} disabled={productRequest.loading}
				>Cancel</Button
			>
			<Button disabled={productRequest.loading} onclick={createProduct}>
				{#if productRequest.loading}
					<Spinner />
				{/if}
				{productRequest.loading ? 'Saving...' : 'Save Product'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
