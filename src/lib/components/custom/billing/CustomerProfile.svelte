<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Edit, History, Phone, Search, User, X } from '@lucide/svelte';
</script>

<div class="shrink-0 flex flex-col gap-2">
	<div class="flex gap-2">
		<div class="relative flex-1">
			<Phone class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder="Enter Mobile / UHID"
				class="pl-9 h-10 border-blue-200 focus-visible:ring-blue-400 bg-white"
			/>
		</div>
		<Button size="icon" class="h-10 w-10 shrink-0">
			<Search class="h-4 w-4" />
		</Button>
	</div>

	<Card.Root class="shadow-sm border-l-4 border-l-blue-500 bg-white">
		<Card.Header class="p-3">
			<div class="flex justify-between items-start">
				<div class="flex gap-3 items-center">
					<div class="bg-blue-100 p-2 rounded-full shrink-0">
						<User class="h-4 w-4 text-blue-700" />
					</div>
					<div class="overflow-hidden">
						<Card.Title class="text-sm font-bold truncate">Bhupen (Patient)</Card.Title>
						<Card.Description class="text-xs truncate">+91 98765XXXXX</Card.Description>
					</div>
				</div>
				<Button variant="ghost" size="icon" class="h-6 w-6 text-muted-foreground">
					<X class="h-3 w-3" />
				</Button>
			</div>
		</Card.Header>
		<Separator />
		<Card.Footer class="p-0 flex">
			<Button variant="ghost" class="flex-1 text-xs h-9 rounded-none border-r rounded-bl-lg">
				<History class="mr-2 h-3 w-3" /> History
			</Button>
			<Button variant="ghost" class="flex-1 text-xs h-9 rounded-none rounded-br-lg">
				<Edit class="mr-2 h-3 w-3" /> Edit Profile
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
