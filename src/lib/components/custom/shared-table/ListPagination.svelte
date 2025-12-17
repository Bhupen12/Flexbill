<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ChevronLeft, ChevronRight } from '@lucide/svelte';

  let { 
    page = $bindable(), 
    size, 
    total, 
    loading 
  } = $props<{
    page: number;
    size: number;
    total: number;
    loading: boolean;
  }>();

  const totalPages = $derived(Math.ceil(total / size));
  const startRecord = $derived((page - 1) * size + 1);
  const endRecord = $derived(Math.min(page * size, total));
</script>

<div class="flex items-center justify-between py-4">
  <div class="text-xs text-muted-foreground">
    Showing <strong>{startRecord}-{endRecord}</strong> of <strong>{total}</strong> records
  </div>

  <div class="flex items-center gap-2">
    <Button 
      variant="outline" 
      size="sm" 
      disabled={page === 1 || loading} 
      onclick={() => page--}
    >
      <ChevronLeft class="h-4 w-4 mr-1" /> Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={page >= totalPages || loading}
      onclick={() => page++}
    >
      Next <ChevronRight class="h-4 w-4 ml-1" />
    </Button>
  </div>
</div>