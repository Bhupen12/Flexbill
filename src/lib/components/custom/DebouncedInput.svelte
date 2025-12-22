<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import { SearchIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { untrack } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		debounce = 500,
		placeholder = 'Search...',
		class: className,
		inputClass,
		...restProps
	} = $props<{
		value: string;
		debounce?: number;
		placeholder?: string;
		class?: string;
		inputClass?: string;
	} & HTMLInputAttributes>();

	let internalValue = $state(value);
	let timer: ReturnType<typeof setTimeout>;
	let isUpdatingFromChild = false; // Flag to track updates originating from this component

	// Effect: Synchronize Parent State -> Internal State
	$effect(() => {
		// 1. Read 'value' here to register it as a dependency for this effect.
		const incomingValue = value;

		// 2. Use 'untrack' to prevent circular dependencies.
		// We only want this effect to run when the parent's 'value' changes,
		// not when 'internalValue' changes.
		untrack(() => {
			// If the update was triggered by the child's debounce logic, skip synchronization
			// to prevent overwriting the user's current input state.
			if (isUpdatingFromChild) {
				isUpdatingFromChild = false;
				return;
			}

			// If the value changed externally (e.g., reset button clicked in parent),
			// sync the internal input state to match.
			if (internalValue !== incomingValue) {
				internalValue = incomingValue;
			}
		});
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		internalValue = target.value;

		clearTimeout(timer);

		// Debounce the update to the parent component
		timer = setTimeout(() => {
			// Set flag to indicate this update is coming from the child
			// This prevents the $effect above from re-syncing and causing a loop
			if (value !== internalValue) {
				isUpdatingFromChild = true;
				value = internalValue;
			}
		}, debounce);
	}
</script>

<InputGroup.Root>
	<InputGroup.Input
		{placeholder}
		class={cn(inputClass)}
		bind:value={internalValue}
		oninput={handleInput}
		{...restProps}
	/>
	<InputGroup.Addon>
		<SearchIcon />
	</InputGroup.Addon>
</InputGroup.Root>