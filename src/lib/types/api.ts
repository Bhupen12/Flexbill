export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  size: number;
  total: number;
};

export type QueryParams = Record<
  string,
  string | number | boolean | undefined
>;