<script lang="ts">
  import { user, isSuperAdmin } from '$lib/stores/user.svelte';
</script>

<h1>Hello, {$user?.id ?? 'Guest'}</h1>

{#if $isSuperAdmin}
  <button>Admin Controls</button>
{/if}