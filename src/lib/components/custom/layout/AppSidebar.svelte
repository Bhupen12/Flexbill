<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { SIDEBAR_BY_ROLE } from '$lib/config/sidebar';
	import { user } from '$lib/stores/user';
	import { ROLES } from '$lib/types';
	import { LogOutIcon, ReceiptIcon } from '@lucide/svelte';

	const role = $user?.role || ROLES.USER;

	const items = $derived(SIDEBAR_BY_ROLE[role] ?? []);

	const isActiveRoute = (url: string) => {
		return $page.url.pathname === url;
	};
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton class="gap-x-4 h-10 px-4">
				{#snippet child({ props })}
					<a href="/" {...props} data-sveltekit-preload-data="hover">
						<ReceiptIcon class="size-4" />
						<span class="font-semibold text-sm">Flex Bill</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each items as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									tooltipContent={item.title}
									isActive={isActiveRoute(item.url)}
									class="gap-x-4 h-10 px-4"
								>
									{#snippet child({ props })}
										<a href={item.url} {...props} data-sveltekit-preload-data="hover">
											<item.icon class="size-4" />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<form action="/auth?/signout" method="post">
					<Sidebar.MenuButton
						class="gap-x-4 h-10 px-4 w-full justify-start"
						tooltipContent="Logout"
					>
						{#snippet child({ props })}
							<button {...props} type="submit">
								<LogOutIcon class="size-4" />
								<span>Logout</span>
							</button>
						{/snippet}
					</Sidebar.MenuButton>
				</form>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
