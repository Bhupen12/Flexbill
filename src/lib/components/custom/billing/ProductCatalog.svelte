<script lang="ts">
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Card from '$lib/components/ui/card';
  import Input from '$lib/components/ui/input/input.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { ScanBarcode, Search } from '@lucide/svelte';
</script>

<Card.Root class="flex h-full flex-col shadow-sm border-slate-200 overflow-hidden">
  <Card.Header class="shrink-0 px-4 py-3 border-b space-y-3 bg-white">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-semibold leading-none">Products</h3>
        <p class="text-xs text-muted-foreground mt-1">Catalog items</p>
      </div>
      <Badge variant="outline">Total: 120</Badge>
    </div>

    <div class="flex gap-2">
      <div class="relative flex-1">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, generic name..."
          class="pl-9 h-9 bg-slate-50"
        />
      </div>
      <Button variant="outline" size="icon" class="h-9 w-9 shrink-0" title="Scan Barcode">
        <ScanBarcode class="h-4 w-4" />
      </Button>
    </div>
  </Card.Header>

  <Card.Content class="flex-1 overflow-y-auto p-4 bg-slate-50/50">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-2">
      {#each Array(20) as _}
        <div
          class="group flex flex-col gap-2 rounded-lg border bg-white p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
        >
          <Skeleton class="aspect-square w-full rounded-md bg-slate-100" />
          <div>
            <Skeleton class="h-4 w-3/4 mb-1" />
            <Skeleton class="h-3 w-1/2" />
          </div>
          <Button
            size="sm"
            variant="secondary"
            class="w-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Add
          </Button>
        </div>
      {/each}
    </div>
  </Card.Content>
</Card.Root>