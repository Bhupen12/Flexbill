<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { ShoppingCart } from '@lucide/svelte';
	import ProductCatalog from '$lib/components/custom/billing/ProductCatalog.svelte';
	import CartSummary from '$lib/components/custom/billing/CartSummary.svelte';

	let isCartOpen = false;
</script>

<div class="flex h-full w-full flex-col gap-2 p-2 pb-20 md:pb-3 overflow-hidden">
	<div class="grid flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-4 min-h-0">
		<div class="flex flex-col gap-2 overflow-hidden md:col-span-3 h-full">
			<ProductCatalog />
		</div>

		<div class="hidden md:flex flex-col gap-2 h-full overflow-hidden">
			<CartSummary />
		</div>
	</div>
</div>

<div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 md:hidden">
	<div class="flex items-center gap-4">
		<Sheet.Root bind:open={isCartOpen}>
			<Sheet.Trigger>
				<Button variant="outline" size="icon" class="relative h-12 w-12 shrink-0">
					<ShoppingCart class="h-5 w-5" />
					<Badge
						variant="destructive"
						class="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
					>
						3
					</Badge>
				</Button>
			</Sheet.Trigger>

			<Sheet.Content side="bottom" class="flex flex-col h-[85vh] p-0 gap-0">
				<div class="flex items-center justify-center p-3 border-b">
					<div class="h-1 w-10 rounded-full bg-muted"></div>
				</div>

				<div class="flex-1 flex flex-col overflow-hidden w-full p-4">
					<CartSummary />
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<Button size="lg" class="flex-1 text-base font-medium">
			Proceed to Book
			<span class="ml-2 border-l border-primary-foreground/20 pl-2 text-sm opacity-80">
				₹1,250
			</span>
		</Button>
	</div>
</div>
