<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Table from '$lib/components/ui/table';

  let { columnCount, rowCount = 5 } = $props<{ 
    columnCount: number; 
    rowCount?: number 
  }>();
</script>

{#each Array(rowCount) as _}
  <Table.Row>
    <Table.Cell colspan={columnCount} class="p-2">
      <Skeleton class="h-8 w-full" />
    </Table.Cell>
  </Table.Row>
{/each}