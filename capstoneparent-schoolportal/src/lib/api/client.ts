/**
 * client.ts
 * Shared fetch primitives used by every domain API module.
 * Nothing else should call `fetch()` directly.
 */

export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/**
 * Generic JSON fetch wrapper.
 * Throws an `Error` whose `.message` is the server's human-readable message,
 * so callers can display it directly in the UI.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      (json as { message?: string; error?: string }).message ??
        (json as { error?: string }).error ??
        "Request failed",
    );
  }

  return json as T;
}

/**
 * Multipart/form-data fetch wrapper.
 * Does NOT set Content-Type — the browser must add the boundary automatically.
 */
export async function apiUpload<T>(path: string, body: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    body,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      (json as { message?: string; error?: string }).message ??
        (json as { error?: string }).error ??
        "Request failed",
    );
  }

  return json as T;
}
