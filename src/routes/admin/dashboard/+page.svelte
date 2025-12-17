<script lang="ts">
  import { user, isAdmin } from '$lib/stores/user';
</script>

<h1>Hello, {$user?.id ?? 'Guest'}</h1>

{#if $isAdmin}
  <button>Admin Controls</button>
{/if}