<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import './layout.css';

	let { children } = $props();
</script>

<Toaster />
{@render children()}
