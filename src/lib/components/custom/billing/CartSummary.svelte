<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="flex-1 flex flex-col min-h-0 overflow-hidden">
	<Card.Root class="flex h-full flex-col shadow-sm border-slate-200 bg-white overflow-hidden">
		<Card.Header class="shrink-0 px-4 py-3 border-b bg-slate-50 flex justify-between items-center">
			<h3 class="font-semibold text-sm">Cart Items</h3>
			<span class="text-xs text-muted-foreground">3 items</span>
		</Card.Header>

		<Card.Content class="flex-1 overflow-y-auto p-0 scrollbar-hide">
			<div class="flex flex-col divide-y">
				{#each Array(10) as _}
					<div class="group flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors">
						<div class="flex-1 space-y-1">
							<p class="text-sm font-medium leading-none">Paracetamol 650</p>
							<p class="text-xs text-muted-foreground">1 Strip x ₹45</p>
						</div>
						<div class="flex items-center border rounded-md bg-white">
							<button class="px-2 py-1 text-xs hover:bg-slate-100">-</button>
							<span class="text-xs font-mono px-1">1</span>
							<button class="px-2 py-1 text-xs hover:bg-slate-100">+</button>
						</div>
					</div>
				{/each}
			</div>
		</Card.Content>

		<Card.Footer class="shrink-0 flex flex-col gap-2 border-t p-3 bg-slate-50">
			<div class="flex w-full justify-between text-sm">
				<span class="text-muted-foreground">Total</span>
				<span class="font-bold text-lg">₹1,250</span>
			</div>
			<Button class="w-full font-semibold shadow-sm">Proceed to Book</Button>
		</Card.Footer>
	</Card.Root>
</div>
