import { page } from "$app/state";
import type { QueryParams } from "$lib/types";

export function getTypedQueryParams(): QueryParams {
  const sp = page.url.searchParams;

  return {
    page: sp.get('page') ? Number(sp.get('page')) : undefined,
    size: sp.get('size') ? Number(sp.get('size')) : undefined,
    search: sp.get('search') ?? undefined,
  };
}
