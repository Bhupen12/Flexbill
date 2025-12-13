<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ROLES } from '$lib/types/auth';
	import { Loader2 } from '@lucide/svelte';

	let userEmail = '';
	let userPassword = '';
	let isSubmitting = false;

	const simulateLoginProcess = async (): Promise<boolean> => {
		isSubmitting = true;
		await new Promise((resolve) => setTimeout(resolve, 2000));
		isSubmitting = false;
		return true;
	};

	async function handleFormSubmit(event: Event) {
		event.preventDefault();
		goto('/super-admin');

		// if (!userEmail || !userPassword) {
		// 	console.log('Details missing');
		// 	return;
		// }

		// const isLoginSuccessful = await simulateLoginProcess();

		// if (isLoginSuccessful) {
		// 	console.log('Login! User:', userEmail);
		// }
	}
</script>

<div class="flex h-screen w-full items-center justify-center bg-gray-50 px-4">
	<Card class="w-full max-w-sm shadow-lg">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-bold">Login</CardTitle>
			<CardDescription>Enter your valid credintials</CardDescription>
		</CardHeader>

		<CardContent class="grid gap-4">
			<form on:submit={handleFormSubmit} class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="xyz@example.com"
						bind:value={userEmail}
						disabled={isSubmitting}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={userPassword} disabled={isSubmitting} />
				</div>

				<Button type="submit" class="w-full" disabled={isSubmitting}>
					{#if isSubmitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					{:else}
						Sign In
					{/if}
				</Button>
			</form>
		</CardContent>

		<CardFooter>
			<p class="w-full text-center text-sm text-muted-foreground">
				No Account? <a href="/register" class="underline hover:text-primary">Sign up</a>
			</p>
		</CardFooter>
	</Card>
</div>
