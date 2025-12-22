<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import DebouncedInput from '../DebouncedInput.svelte';

	let {
		search = $bindable(),
		size = $bindable(),
		page = $bindable(),
		placeholder = 'Search...'
	} = $props<{
		search: string;
		size: number;
		page: number;
		placeholder?: string;
	}>();

	const pageSizes = [
		{ value: '10', label: '10 rows' },
		{ value: '20', label: '20 rows' },
		{ value: '50', label: '50 rows' }
	];
</script>

<div class="flex items-center justify-between gap-4">
	<div class="relative w-full max-w-sm">
		<DebouncedInput bind:value={search} {placeholder} class="w-full max-w-sm" />
	</div>

	<div class="flex items-center gap-2">
		<Select.Root
			type="single"
			value={String(size)}
			onValueChange={(v) => {
				size = Number(v);
				page = 1;
			}}
		>
			<Select.Trigger class="w-25">
				{pageSizes.find((p) => p.value === String(size))?.label}
			</Select.Trigger>
			<Select.Content>
				{#each pageSizes as ps}
					<Select.Item value={ps.value}>{ps.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>
