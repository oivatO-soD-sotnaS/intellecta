// lib/apiClient.ts

type JsonLike = { [k: string]: any } | null;

const SESSION_COOKIE = "session_expired";

// rotas de autenticação onde NÃO queremos disparar modal/redirect (ex.: erro de credenciais no próprio login)
function isAuthRoute(input: RequestInfo): boolean {
  const url = typeof input === "string" ? input : (input as Request).url;
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return u.pathname.startsWith("/auth");
  } catch {
    // se não der pra parsear, assume que não é rota de auth
    return false;
  }
}

function isClient() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function handleUnauthorized(shouldRedirect: boolean) {
  try {
    // 1) cookie que o SessionGuard / LoginPage usam para abrir o modal
    document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=120; SameSite=Lax`;

    // 2) broadcast p/ outras abas/componentes
    try {
      const bc = new BroadcastChannel("auth");
      bc.postMessage("expired");
      // fecha logo para não vazar handle
      setTimeout(() => bc.close(), 0);
    } catch {}

    // 3) redireciona depois de um breve delay (deixa o modal aparecer)
    if (shouldRedirect) {
      const next = window.location.pathname + window.location.search + window.location.hash;
      setTimeout(() => {
        // window.location.href = `/auth/login?expired=1&next=${encodeURIComponent(next)}`;
        window.location.href = `/sign-in`;
      }, 800);
    }
  } catch {
    /* ambiente SSR não tem window/document */
  }
}

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

  // 401: sessão expirada/sem token → dispara modal + (opcional) redirect
  if (res.status === 401) {
    if (isClient() && !isAuthRoute(input)) {
      handleUnauthorized(true);
    }
    // importante: não tentar ler body depois; só sinalizamos e falhamos
    throw new Error("UNAUTHORIZED");
  }

  // Sucesso sem body
  if ([204, 205, 304].includes(res.status)) {
    return null as unknown as T;
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson =
    contentType.includes("application/json") || contentType.includes("application/problem+json");

  // lê o corpo UMA única vez
  const payload: JsonLike | string = await (async () => {
    try {
      if (isJson) return (await res.json()) as JsonLike;
      return (await res.text()) as string;
    } catch {
      return isJson ? ({} as JsonLike) : "";
    }
  })();

  if (!res.ok) {
    // mensagem de erro amigável (sem reler o body)
    let msg = "";
    if (typeof payload === "string") {
      msg = payload;
    } else if (payload) {
      if (typeof payload.message === "string") msg = payload.message;
      else if (typeof payload.error === "string") msg = payload.error;
      else if (payload.error && typeof (payload.error as any).message === "string")
        msg = (payload.error as any).message;
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
