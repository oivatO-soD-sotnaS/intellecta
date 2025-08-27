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
    const payload = await parse().catch(() => undefined as any);
    let msg = "";
    if (typeof payload === "string") msg = payload;
    else if (payload) {
      if (typeof payload.message === "string") msg = payload.message;
      else if (typeof payload.error === "string") msg = payload.error;
      else if (payload.error && typeof payload.error.message === "string") msg = payload.error.message;
      else msg = JSON.stringify(payload);
    }
    throw new Error(msg || `Erro ${res.status}`);
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
