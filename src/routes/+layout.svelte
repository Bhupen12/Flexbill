<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import './layout.css';

	let { children } = $props();
</script>

<Toaster 
  position="top-center" 
  theme="system"
  duration={4000} 
  closeButton 
/>
{@render children()}
