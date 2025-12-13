<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { PlusIcon } from "@lucide/svelte";

	type EntityHeaderProps = {
		title: string;
		subtitle?: string;
		newButtonLabel: string;
		disabled?: boolean;
		isCreating?: boolean;
	} & (
		| { onNew: () => void; newButtonHref?: never }
		| { newButtonHref: string; onNew?: never }
		| { newButtonHref?: never; onNew?: never }
	);

	const {
		title,
		subtitle,
		newButtonLabel = 'New',
		disabled = false,
		isCreating = false,
		onNew,
		newButtonHref
	}: EntityHeaderProps = $props();
</script>

<div class="flex flex-row items-center justify-between gap-x-4">
  <div class="flex flex-col">
    <h1 class="text-lg md:text-xl font-semibold">{title}</h1>
    {#if subtitle}
      <p class="text-xs md:text-sm text-muted-foreground">{subtitle}</p>
    {/if}
  </div>
  {#if onNew}
    <Button
      onclick={onNew}
      size="sm"
      disabled={disabled || isCreating}
    > 
      <PlusIcon class="size-4" /> 
      {newButtonLabel}
    </Button>
  {:else if newButtonHref}
    <Button
      href={newButtonHref}
      size="sm"
      disabled={disabled || isCreating}
    > 
      <PlusIcon class="size-4" />
      {newButtonLabel}
    </Button>
  {/if}
</div>