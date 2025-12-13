<script lang='ts'>
	import EntityHeader from "../shared/entity-header.svelte";

  type OrganizationHeaderProps = {
    disabled?: boolean;
  }
  const { disabled = false }: OrganizationHeaderProps = $props();
</script>

<EntityHeader
  title="Organizations"
  subtitle="Manage your organizations here."
  onNew={() => {}}
  newButtonLabel="Create Organization"
  {disabled}
  isCreating={false}
/>