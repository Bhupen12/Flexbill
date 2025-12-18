import { PAGINATION } from '$lib/constants';

export function resolvePagination(url: URL) {
  let page = Number(url.searchParams.get('page'));
  let size = Number(url.searchParams.get('size'));

  if (!Number.isInteger(page) || page < 1) {
    page = PAGINATION.DEFAULT_PAGE;
  }

  if (
    !Number.isInteger(size) ||
    size < PAGINATION.MIN_PAGE_SIZE
  ) {
    size = PAGINATION.DEFAULT_PAGE_SIZE;
  }

  size = Math.min(size, PAGINATION.MAX_PAGE_SIZE);

  return {
    page,
    size,
    offset: (page - 1) * size
  };
}
