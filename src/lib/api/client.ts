import type { QueryParams } from "$lib/types";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    ...options,
    headers: {...defaultHeaders, ...options.headers},
  });

  let responseData: any;
  try {
    responseData = await res.json()
  } catch {
    responseData = null;
  }

  if (!res.ok) {
    const errorMessage = responseData?.message || `API Error: ${res.statusText}`;
    throw new ApiError(
      errorMessage,
      res.status,
      responseData
    );
  }

  return responseData as T;
}

export function buildQuery(params?: QueryParams): string {
  if (!params) return '';

  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      qs.set(key, String(value));
    }
  }

  const query = qs.toString();
  return query ? `?${query}` : '';
}