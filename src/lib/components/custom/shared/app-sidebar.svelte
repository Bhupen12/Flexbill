<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { SIDEBAR_BY_ROLE } from '$lib/config/sidebar';
	import { useAuth } from '$lib/context/auth.svelte';
	import { LogOutIcon, ReceiptIcon } from '@lucide/svelte';

	const { role } = useAuth();

	const items = SIDEBAR_BY_ROLE[role] ?? [];

	function logout() {
		goto('/');
	}

	const isActiveRoute = (url: string) => {
		return $page.url.pathname === url;
	};
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton class="gap-x-4 h-10 px-4">
				{#snippet child({ props })}
					<a href="/Home" data-sveltekit-preload-data="hover" class="flex">
						<ReceiptIcon />
						<span class="font-semibold text-sm">Flex Bill</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each items as group, index (group.title)}
			<Sidebar.Group id={group.title}>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
							<Sidebar.MenuItem id={item.title}>
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
				<Sidebar.MenuButton class="gap-x-4 h-10 px-4" tooltipContent="Logout" onclick={logout}>
					<LogOutIcon />
					<span>Logout</span>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
