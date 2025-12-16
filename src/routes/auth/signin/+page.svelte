<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<h1>Login</h1>

<form method="POST" action="?/login" use:enhance>
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />

  <button>Login</button>

  {#if form?.message}
    <p style="color:red">{form.message}</p>
  {/if}
</form>