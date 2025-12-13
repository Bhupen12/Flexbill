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