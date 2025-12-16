<script lang="ts">
  export let data
</script>

<h1>Welcome 👋</h1>

<div style="margin-top: 16px">
  <p><b>User ID:</b> {data.user.id}</p>
  <p><b>Email:</b> {data.user.email}</p>
</div>

<form method="POST" action="/signout" style="margin-top: 24px">
  <button>Logout</button>
</form>
