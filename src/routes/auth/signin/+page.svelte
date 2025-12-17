<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from '../$types';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole } from '@lucide/svelte';

	let { form } = $props<{ form: ActionData }>();

	let loading = $state(false);
	let showPassword = $state(false);

	const submitLogin: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
		};
	};
</script>

<div class="min-h-screen flex items-center justify-center bg-muted/40 p-4">
	<Card.Root class="w-full max-w-sm shadow-lg border-muted">
		<Card.Header class="space-y-1 text-center">
			<div class="flex justify-center mb-2">
				<div class="p-3 bg-primary/10 rounded-full">
					<LockKeyhole class="h-6 w-6 text-primary" />
				</div>
			</div>
			<Card.Title class="text-2xl font-bold">Welcome back</Card.Title>
			<Card.Description>Enter your credentials to access your account</Card.Description>
		</Card.Header>

		<Card.Content>
			<form method="POST" action="/auth?/signin" use:enhance={submitLogin} class="space-y-4">
				{#if form?.message}
					<div
						class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20"
					>
						<AlertCircle class="h-4 w-4" />
						<p>{form.message}</p>
					</div>
				{/if}

				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="name@example.com"
						required
						disabled={loading}
					/>
				</div>

				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<Label for="password">Password</Label>
						<a
							href="/auth/forgot-password"
							class="text-xs text-primary underline-offset-4 hover:underline"
						>
							Forgot password?
						</a>
					</div>

					<div class="relative">
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							required
							disabled={loading}
							class="pr-10"
						/>
						<button
							type="button"
							class="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
							onclick={() => (showPassword = !showPassword)}
							tabindex="-1"
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
							<span class="sr-only">Toggle password visibility</span>
						</button>
					</div>
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Signing in...
					{:else}
						Sign In
					{/if}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer>
			<div class="text-sm text-muted-foreground text-center w-full">
				Don't have an account?
				<a href="/auth/register" class="text-primary underline-offset-4 hover:underline">
					Sign up
				</a>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
