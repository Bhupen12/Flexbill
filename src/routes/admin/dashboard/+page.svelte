<script lang="ts">
  import { user, isAdmin } from '$lib/stores/user.svelte';
</script>

<h1>Hello, {$user?.id ?? 'Guest'}</h1>

{#if $isAdmin}
  <button>Admin Controls</button>
{/if}