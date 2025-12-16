<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  let email = ''
  let password = ''
  let loading = false
  let error = ''

  async function login() {
    loading = true
    error = ''

    const supabase = $page.data.supabase

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    loading = false

    if (authError) {
      error = authError.message
      return
    }

    goto('/org/billing')
  }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={login}>
  <input
    type="email"
    placeholder="Email"
    bind:value={email}
    required
  />

  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />

  <button disabled={loading}>
    {loading ? 'Logging in…' : 'Login'}
  </button>

  {#if error}
    <p style="color:red">{error}</p>
  {/if}
</form>
