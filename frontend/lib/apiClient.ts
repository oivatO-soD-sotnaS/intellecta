// lib/apiClient.ts
type JsonLike = { [k: string]: any } | null;

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

  // Sucesso sem body
  if ([204, 205, 304].includes(res.status)) {
    return null as unknown as T;
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const parse = async (): Promise<JsonLike | string> =>
    isJson ? (await res.json().catch(() => ({} as JsonLike))) : await res.text().catch(() => "");

  const payload = await parse();

  if (!res.ok) {
    const msg =
      (typeof payload === "object" && payload && (payload.message || payload.error)) ||
      (typeof payload === "string" ? payload : "") ||
      `Erro ${res.status}`;
    throw new Error(msg);
  }

  return payload as T;
}

export const apiGet = <T>(url: string) => apiRequest<T>(url);

export const apiPost = <T>(url: string, body?: unknown) =>
  apiRequest<T>(url, {
    method: "POST",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

export const apiPut = <T>(url: string, body?: unknown) =>
  apiRequest<T>(url, {
    method: "PUT",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

export const apiDelete = <T>(url: string) =>
  apiRequest<T>(url, { method: "DELETE" });
