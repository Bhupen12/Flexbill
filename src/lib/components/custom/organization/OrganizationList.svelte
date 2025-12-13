<script lang="ts">
	import { organizationsApi } from "$lib/api";
	import type { OrganizationSelect } from "$lib/types";
	import { onMount } from "svelte";

  let organizations: OrganizationSelect[] = [];

  async function fetchAllOrganizations() {
    organizations = await organizationsApi.list();
  }

  onMount(()=>{
    fetchAllOrganizations();
  })
</script>

{JSON.stringify(organizations, null, 2)}