<script lang="ts" generics="T">
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import * as Table from '$lib/components/ui/table';
	import { Inbox } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

  let { 
    loading, 
    data, 
    columns, 
    row 
  } = $props<{
    loading: boolean;
    data: T[];
    columns: { label: string; class?: string }[];
    row: Snippet<[T]>;
  }>();
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      <Table.Row class="bg-muted/50">
        {#each columns as col}
          <Table.Head class={col.class}>{col.label}</Table.Head>
        {/each}
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#if loading}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">
            <div class="flex items-center justify-center text-muted-foreground">
              <Spinner /> Loading data...
            </div>
          </Table.Cell>
        </Table.Row>
      {:else if data.length === 0}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-75 text-center">
            <div class="flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Inbox class="h-10 w-10 opacity-20" />
              <p>No records found.</p>
            </div>
          </Table.Cell>
        </Table.Row>
      {:else}
        {#each data as item}
           {@render row(item)}
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>
</div>