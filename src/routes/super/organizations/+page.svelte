<script lang="ts">
  import { organizationsApi } from '$lib/api';
  import type { OrganizationSelect } from '$lib/types';
  import OrganizationCreate from './OrganizationCreate.svelte';

  // UI Components
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import * as Card from '$lib/components/ui/card';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import Badge from '$lib/components/ui/badge/badge.svelte';

  // Icons
  import { 
    Search, 
    MoreHorizontal, 
    ChevronLeft, 
    ChevronRight,
    Building2,
    Globe,
    Banknote,
    Loader2
  } from '@lucide/svelte';

  let organizations = $state<OrganizationSelect[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Pagination state
  let page = $state(1);
  let size = $state(2); // Changed default to 10 for better view
  let total = $state(0);
  let search = $state('');

  const totalPages = $derived(Math.ceil(total / size));

  // Display text for pagination info
  const startRecord = $derived((page - 1) * size + 1);
  const endRecord = $derived(Math.min(page * size, total));

  const pageSizes = [
    { value: '10', label: '10 rows' },
    { value: '20', label: '20 rows' },
    { value: '50', label: '50 rows' }
  ];

  async function loadOrganizations() {
    loading = true;
    try {
      const res = await organizationsApi.list({
        page,
        size,
        search: search || undefined
      });

      organizations = res.data;
      total = res.total;
    } catch (e) {
      error = 'Failed to load organizations';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleCreated(newOrgData: OrganizationSelect) {
    organizations = [newOrgData, ...organizations];
    if (organizations.length > size) organizations.pop();
    total += 1;
  }

  $effect(() => {
    loadOrganizations();
    // Dependencies
    page; size; search;
  });
</script>

<div class="flex flex-col gap-6 p-6">
  
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Organizations</h1>
      <p class="text-muted-foreground">Manage workspaces and tenant configurations.</p>
    </div>
    <OrganizationCreate onCreated={handleCreated} />
  </div>

  <Card.Root>
    <Card.Header class="pb-2">
      <div class="flex items-center justify-between gap-4">
        <div class="relative w-full max-w-sm">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search organizations..."
            class="pl-9"
            bind:value={search}
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
          <Select.Root type="single" value={String(size)} onValueChange={(v) => { size = Number(v); page = 1; }}>
            <Select.Trigger class="w-25">
               {pageSizes.find(p => p.value === String(size))?.label}
            </Select.Trigger>
            <Select.Content>
              {#each pageSizes as ps}
                <Select.Item value={ps.value}>{ps.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </Card.Header>

    <Card.Content>
      <div class="rounded-md border">
        <Table.Root>
          <Table.Header>
            <Table.Row class="bg-muted/50">
              <Table.Head class="w-75">Organization Name</Table.Head>
              <Table.Head>Code</Table.Head>
              <Table.Head>Timezone</Table.Head>
              <Table.Head>Currency</Table.Head>
              <Table.Head class="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {#if loading}
              <Table.Row>
                <Table.Cell colspan={5} class="h-24 text-center">
                   <div class="flex items-center justify-center text-muted-foreground">
                      <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Loading organizations...
                   </div>
                </Table.Cell>
              </Table.Row>
            {:else if organizations.length === 0}
              <Table.Row>
                <Table.Cell colspan={5} class="h-75 text-center">
                  <div class="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Building2 class="h-10 w-10 opacity-20" />
                    <p>No organizations found.</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            {:else}
              {#each organizations as org (org.id)}
                <Table.Row>
                  <Table.Cell>
                    <div class="flex items-center gap-3">
                      <div class="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/50">
                        <Building2 class="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium">{org.name}</span>
                        <span class="text-xs text-muted-foreground truncate max-w-50">ID: {org.id}</span>
                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                     {#if org.code}
                      <Badge variant="outline" class="font-mono">{org.code}</Badge>
                     {:else}
                      <span class="text-muted-foreground">-</span>
                     {/if}
                  </Table.Cell>

                  <Table.Cell>
                    <div class="flex items-center text-sm text-muted-foreground">
                      <Globe class="mr-2 h-3.5 w-3.5 opacity-70" /> {org.timezone}
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div class="flex items-center text-sm text-muted-foreground">
                       <Banknote class="mr-2 h-3.5 w-3.5 opacity-70" /> {org.currency}
                    </div>
                  </Table.Cell>

                  <Table.Cell class="text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button {...props} variant="ghost" size="icon" class="h-8 w-8">
														<MoreHorizontal class="h-4 w-4" />
														<span class="sr-only">Open menu</span>
													</Button>
												{/snippet}
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Label>Actions</DropdownMenu.Label>
                        <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(org.id)}>
                          Copy Org ID
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item>
                           View Settings
                        </DropdownMenu.Item>
                        <DropdownMenu.Item class="text-destructive">
                           Archive Organization
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
        </Table.Root>
      </div>
    </Card.Content>

    <Card.Footer class="flex items-center justify-between py-4">
      <div class="text-xs text-muted-foreground">
        Showing <strong>{startRecord}-{endRecord}</strong> of <strong>{total}</strong> organizations
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
    </Card.Footer>
  </Card.Root>
</div>