<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { SIDEBAR_BY_ROLE } from '$lib/config/sidebar';
  import { useAuth } from '$lib/context/auth.svelte';
  import { LogOutIcon } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  const { role } = useAuth();

  const items = SIDEBAR_BY_ROLE[role] ?? [];

  function logout() {
    goto('/');
  }
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>

      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton onclick={logout}>
          <LogOutIcon />
          <span>Logout</span>
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>