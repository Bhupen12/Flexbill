<script lang="ts">
	import { productsApi } from '$lib/api';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Empty from '$lib/components/ui/empty/index';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import type { PaginatedResponse, ProductSelectType } from '$lib/types';
	import { AsyncRequest } from '$lib/utils/asyncHandler.svelte';
	import { InboxIcon, ScanBarcode, Package, Tag, Search, Inbox } from '@lucide/svelte';
	import DebouncedInput from '$lib/components/custom/DebouncedInput.svelte';
	import { globalCart } from '$lib/stores/cart.svelte';

	let products = $state<ProductSelectType[]>([]);
	let loading = $state<boolean>(false);
	let search = $state('');
	let size = 10;

	const productRequest = new AsyncRequest<PaginatedResponse<ProductSelectType>>();

	async function searchProduct() {
		loading = true;
		await productRequest.call(productsApi.list({ size, search }), {
			onSuccess: (res) => {
				products = res.data;
			}
		});
		loading = false;
	}

	function addToCart(product: ProductSelectType) {
		globalCart.add(product);
	}

	$effect(() => {
		searchProduct();
	});
</script>

<Card.Root
	class="flex h-full flex-col border-none bg-slate-50/50 sm:border sm:bg-white sm:shadow-sm"
>
	<Card.Header
		class="sticky top-0 z-10 shrink-0 border-b bg-white/80 px-4 py-3 backdrop-blur-sm space-y-3"
	>
		<div class="flex items-center justify-between">
			<div>
				<h3 class="font-semibold text-slate-900">Products</h3>
				<p class="text-xs text-muted-foreground">Select items to add</p>
			</div>
			<Badge variant="secondary" class="font-normal text-xs">
				{products.length} Items
			</Badge>
		</div>

		<div class="flex gap-2">
			<div class="relative flex-1">
				<DebouncedInput
					bind:value={search}
					placeholder="Search products..."
					class="h-9 bg-slate-50"
				/>
			</div>
			<Button variant="outline" size="icon" class="h-9 w-9 shrink-0" title="Scan">
				<ScanBarcode class="h-4 w-4 text-slate-600" />
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="flex-1 overflow-y-auto p-2 sm:p-4">
		<div
			class="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
		>
			{#if loading}
				{#each Array(8) as _}
					<div class="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
						<Skeleton class="h-10 w-10 shrink-0 rounded-md bg-slate-100" />
						<div class="flex-1 space-y-1">
							<Skeleton class="h-3 w-3/4" />
							<Skeleton class="h-2 w-1/2" />
						</div>
					</div>
				{/each}
			{:else if products.length > 0}
				{#each products as product (product.id)}
					<div
						class="flex flex-col justify-between gap-3 rounded-lg border bg-white p-3 shadow-sm transition-transform active:scale-[0.99] sm:hover:border-blue-400"
					>
						<div class="flex items-start gap-3">
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500"
							>
								<InboxIcon class="size-5" />
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex justify-between">
									<h4 class="truncate text-sm font-medium text-slate-900" title={product.name}>
										{product.name}
									</h4>
									{#if product.is_active}
										<span class="block h-1.5 w-1.5 shrink-0 rounded-full bg-green-500 mt-1.5"
										></span>
									{/if}
								</div>
								<p class="truncate text-xs text-muted-foreground">
									SKU: {product.sku || '--'}
								</p>
							</div>
						</div>

						<div class="flex items-center justify-between gap-2 border-t pt-2">
							<span
								class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
							>
								{product.unit}
							</span>

							<Button
								size="sm"
								variant="secondary"
								class="h-7 px-3 text-xs font-medium hover:bg-slate-200"
								onclick={() => {
									addToCart(product);
								}}
							>
								Add
							</Button>
						</div>
					</div>
				{/each}
			{:else}
				<Empty.Root class="col-span-full">
					<Empty.Header>
						<Empty.Media variant="icon" class="mx-auto">
							<Inbox class="size-10 text-muted-foreground" />
						</Empty.Media>
						<Empty.Title>No products found</Empty.Title>
						<Empty.Description>Check spelling or try a new search.</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
