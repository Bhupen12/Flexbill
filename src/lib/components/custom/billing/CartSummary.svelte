<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { globalCart } from '$lib/stores/cart.svelte';
</script>

<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
	<Card.Root class="flex h-full flex-col shadow-sm border-slate-200 bg-white overflow-hidden">
		<Card.Header class="shrink-0 px-4 py-3 border-b bg-slate-50 flex justify-between items-center">
			<h3 class="font-semibold text-sm">Cart Items</h3>
			<span class="text-xs text-muted-foreground">
				{globalCart.totalItemsCount}
				{globalCart.totalItemsCount === 1 ? 'item' : 'items'}
			</span>
		</Card.Header>

		<Card.Content class="flex-1 overflow-y-auto p-0 scrollbar-hide">
			{#if globalCart.items.length === 0}
				<div class="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
					<p class="text-sm">No Items!</p>
				</div>
			{:else}
				<div class="flex flex-col divide-y">
					{#each globalCart.items as item (item.product.id)}
						<div class="group flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
							<div class="flex-1 space-y-1">
								<p class="text-sm font-medium leading-none truncate max-w-45">
									{item.product.name}
								</p>
								<p class="text-xs text-muted-foreground">
									₹{item.unitPrice} / unit
								</p>
							</div>

							<div class="flex items-center border rounded-md bg-white">
								<button
									class="px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-50"
									onclick={() => globalCart.decrease(item.product.id)}
								>
									-
								</button>

								<span class="text-xs font-mono px-2 min-w-5 text-center">
									{item.quantity}
								</span>

								<button
									class="px-2 py-1 text-xs hover:bg-slate-100"
									onclick={() => globalCart.add(item.product)}
								>
									+
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>

		<Card.Footer class="shrink-0 flex flex-col gap-2 border-t p-3 bg-slate-50">
			<div class="flex w-full justify-between text-sm">
				<span class="text-muted-foreground">Total</span>
				<span class="font-bold text-lg">₹{globalCart.totalPrice}</span>
			</div>

			<Button class="w-full font-semibold shadow-sm" disabled={globalCart.items.length === 0}>
				Proceed to Book
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
