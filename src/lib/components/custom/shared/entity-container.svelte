<script lang="ts">
	import type { Snippet } from "svelte";

	type EntityContainerProps = {
		children: Snippet;
		header?: Snippet;
    search?: Snippet;
    pagination?: Snippet;
	};

	const { header, children }: EntityContainerProps = $props();
</script>

<div class="p-4 md:px-10 md:py-6 h-full">
  <div class="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
    {#if header}
      {@render header?.()}
    {/if}
  </div>
	<main>
		{@render children?.()}
	</main>
</div>
