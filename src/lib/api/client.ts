import type { QueryParams } from "$lib/types";

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    let errorMessage = 'API request failed';
    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {
      // Ignore JSON parsing errors
    }
    throw new Error(errorMessage);
  }

  return data as T;
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