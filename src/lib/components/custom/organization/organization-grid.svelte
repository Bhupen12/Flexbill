<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { OrganizationSelect } from '$lib/types';
	import { Building2Icon, CalendarIcon, PencilIcon, PlusIcon, Trash2Icon } from '@lucide/svelte';

	let {
		organizations,
		loading = false,
		onAdd,
		onEdit,
		onDelete
	}: {
		organizations: OrganizationSelect[];
		loading?: boolean;
		onAdd: (name: string, code: string) => void;
		onEdit: (id: string) => void;
		onDelete: (id: string) => void;
	} = $props();

	let dialogOpen = $state(false);
	let newName = $state('');
	let newCode = $state('');

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (newName.trim()) {
			try {
				await onAdd(newName.trim(), newCode.trim());
				newName = '';
				newCode = '';
				dialogOpen = false;
			} catch (error) {
				// Handle error (show toast, set error state, etc.)
			}
		}
	}

	function handleEdit(org: OrganizationSelect) {
		onEdit(org.id);
	}

	function handleDeleteClick(org: OrganizationSelect) {
		if (
			confirm(
				`Are you sure you want to delete the organization "${org.name}"? This action cannot be undone.`
			)
		) {
			onDelete(org.id);
		}
	}
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
	<Button
		variant="outline"
		class="group flex min-h-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-transparent transition-all hover:border-primary/50 hover:bg-muted/30"
		onclick={() => (dialogOpen = true)}
	>
		<div
			class="flex flex-col items-center gap-3 text-muted-foreground transition-colors group-hover:text-primary"
		>
			<div class="rounded-full bg-muted p-3 transition-colors group-hover:bg-primary/10">
				<PlusIcon class="h-6 w-6" />
			</div>
			<span class="font-medium">Add Organization</span>
		</div>
	</Button>
	{#each organizations as org (org.id)}
		<Card.Root
			class="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
		>
			<div
				class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
			/>

			<Card.Content class="p-5">
				<div class="flex items-start gap-3 mb-4">
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
					>
						<Building2Icon class="h-5 w-5" />
					</div>
					<div class="min-w-0 flex-1">
						<h3 class="truncate text-lg font-semibold text-foreground">{org.name}</h3>
						{#if org.code}
							<Badge>{org.code}</Badge>
						{:else}
							<span class="text-xs text-muted-foreground">No code assigned</span>
						{/if}
					</div>
				</div>
				<div class="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
					<CalendarIcon class="h-4 w-4" />
					<span>Created {formatDate(org.created_at)}</span>
				</div>

				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm" onclick={() => handleEdit(org)} class="flex-1">
						<PencilIcon class="mr-2 h-4 w-4" />
						Edit
					</Button>
					<Button
						variant="outline"
						size="sm"
						onclick={() => handleDeleteClick(org)}
						class="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
					>
						<Trash2Icon class="mr-2 h-4 w-4" />
						Delete
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Organization</Dialog.Title>
			<Dialog.Description>
				Create a new organization by providing a name and optional code.
			</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input id="name" bind:value={newName} placeholder="Organization name" required />
			</div>
			<div class="space-y-2">
				<Label for="code">Code</Label>
				<Input id="code" bind:value={newCode} placeholder="ORG" />
			</div>
			<div class="flex justify-end gap-2 pt-2">
				<Button type="button" variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
				<Button type="submit">Add</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
