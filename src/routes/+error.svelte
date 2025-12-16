<script>
    import { page } from '$app/stores';
</script>

<div style="text-align: center; margin-top: 50px;">
    <h1 style="font-size: 3rem;">{$page.status}</h1>
    <p style="font-size: 1.5rem;">{$page.error?.message}</p>
    
    <a href="/" style="display: inline-block; margin-top: 20px;">
        Go back Home
    </a>
</div>