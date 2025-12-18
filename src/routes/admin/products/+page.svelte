<script lang="ts">
	import { productsApi } from '$lib/api';
	import type { PaginatedResponse, ProductSelectType } from '$lib/types';
	import ProductCreate from './ProductCreate.svelte';
	// Shared Components
	import DataTable from '$lib/components/custom/shared-table/DataTable.svelte';
	import ListPagination from '$lib/components/custom/shared-table/ListPagination.svelte';
	import ListToolbar from '$lib/components/custom/shared-table/ListToolbar.svelte';
	// UI Components
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { AsyncRequest } from '$lib/utils/asyncHandler.svelte';
	import { MoreHorizontal, Package, Percent, Tag } from '@lucide/svelte';

	// State
	let products = $state<ProductSelectType[]>([]);

	// Pagination & Search
	let page = $state(1);
	let size = $state(10);
	let total = $state(0);
	let search = $state('');

	// Table Columns (No Org ID here)
	const columns = [
		{ label: 'Product Details', class: 'w-96' },
		{ label: 'SKU' },
		{ label: 'Unit' },
		{ label: 'Tax' },
		{ label: 'Status' },
		{ label: 'Actions', class: 'text-right' }
	];

	const productRequest = new AsyncRequest<PaginatedResponse<ProductSelectType>>();
	async function loadProducts() {
		await productRequest.call(productsApi.list({ page, size, search }), {
			onSuccess: (res) => {
				products = res.data;
				total = res.total;
			}
		});
	}

	function handleProductCreated(newProduct: ProductSelectType) {
		total += 1;
		if (page === 1) {
			products = [newProduct, ...products];
			if (products.length > size) products.pop();
		} else {
			page = 1;
		}
	}

	$effect(() => {
		loadProducts();
		page;
		size;
		search;
	});
</script>

<div class="flex flex-col gap-6 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Products</h1>
			<p class="text-muted-foreground">Manage your inventory catalog.</p>
		</div>
		<ProductCreate onCreated={handleProductCreated} />
	</div>

	<Card.Root>
		<Card.Header class="pb-2">
			<ListToolbar bind:search bind:size bind:page placeholder="Search products..." />
		</Card.Header>

		<Card.Content>
			<DataTable loading={productRequest.loading} data={products} {columns}>
				{#snippet row(product: ProductSelectType)}
					<Table.Row>
						<Table.Cell>
							<div class="flex items-start gap-3">
								<div
									class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/50"
								>
									<Package class="h-4 w-4 text-muted-foreground" />
								</div>
								<div class="flex flex-col">
									<span class="font-medium">{product.name}</span>
									{#if product.description}
										<span
											class="text-xs text-muted-foreground line-clamp-1 max-w-xs"
											title={product.description}
										>
											{product.description}
										</span>
									{:else}
										<span class="text-xs text-muted-foreground italic">No description</span>
									{/if}
								</div>
							</div>
						</Table.Cell>

						<Table.Cell>
							{#if product.sku}
								<div class="flex items-center text-xs font-mono bg-muted px-2 py-1 rounded w-fit">
									<Tag class="mr-1 h-3 w-3 opacity-50" />
									{product.sku}
								</div>
							{:else}
								<span class="text-muted-foreground text-xs">-</span>
							{/if}
						</Table.Cell>

						<Table.Cell>
							<span class="capitalize text-sm">{product.unit}</span>
						</Table.Cell>

						<Table.Cell>
							<div class="flex items-center text-sm gap-2">
								{product.tax_percent}
								<Percent class="size-4 text-muted-foreground" />
							</div>
						</Table.Cell>

						<Table.Cell>
							<Badge variant={product.is_active ? 'default' : 'secondary'}>
								{product.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</Table.Cell>

						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="ghost" size="icon" class="h-8 w-8">
											<MoreHorizontal class="h-4 w-4" />
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(product.id)}>
										Copy ID
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item>Edit Product</DropdownMenu.Item>
									<DropdownMenu.Item class="text-destructive">Delete</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/snippet}
			</DataTable>
		</Card.Content>

		<Card.Footer>
			<div class="w-full">
				<ListPagination bind:page {size} {total} loading={productRequest.loading} />
			</div>
		</Card.Footer>
	</Card.Root>
</div>
