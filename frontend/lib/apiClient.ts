// lib/apiClient.ts
export async function apiRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });

  // sucesso sem body
  if (res.status === 204) return null as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  const parse = async () => (contentType.includes("application/json") ? res.json() : res.text());

  if (!res.ok) {
    const data = await parse().catch(() => undefined);
    const msg = (data && (data.message || data.error)) || (typeof data === "string" ? data : "");
    throw new Error(msg || `Erro ${res.status}`);
  }

  return (await parse()) as T;
}

export const apiGet    = <T>(url: string) => apiRequest<T>(url);
export const apiPost   = <T>(url: string, body?: unknown) => apiRequest<T>(url, { method: "POST", body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
export const apiPut    = <T>(url: string, body?: unknown) => apiRequest<T>(url, { method: "PUT",  body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
export const apiDelete = <T>(url: string) => apiRequest<T>(url, { method: "DELETE" });
