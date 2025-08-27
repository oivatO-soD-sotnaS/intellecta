// app/api/_lib/proxy.ts
import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_BASE_URL!;
if (!API) throw new Error("API_BASE_URL não definida");

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ProxyOptions = {
  includeBody?: boolean;
  headers?: Record<string, string>;
  addAuth?: boolean;
  tokenCookieNames?: string[];
  clearCookies?: string[];
  /** Se definido, quando o upstream retornar 404 respondemos 200 com esse JSON */
  map404ToJSON?: unknown;
};

const DEFAULT_TOKEN_COOKIES = ["token", "auth_token", "Authorization"];

function getTokenFromCookies(req: NextRequest, names = DEFAULT_TOKEN_COOKIES) {
  for (const n of names) {
    const v = req.cookies.get(n)?.value;
    if (v) return v;
  }
  return undefined;
}

async function buildBody(req: NextRequest, headers: Record<string, string>) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const json = await req.json();
    headers["Content-Type"] = "application/json";
    return JSON.stringify(json);
  }
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    // NÃO setar Content-Type manualmente para FormData (o fetch define o boundary)
    return fd as unknown as BodyInit;
  }
  const text = await req.text();
  if (text) headers["Content-Type"] = ct || "text/plain";
  return text;
}

export async function proxy(
  req: NextRequest,
  method: Method,
  upstreamPath: string,
  opts: ProxyOptions = {}
): Promise<NextResponse> {
  const {
    includeBody = method !== "GET" && method !== "DELETE",
    headers: extraHeaders = {},
    addAuth = true,
    tokenCookieNames = DEFAULT_TOKEN_COOKIES,
    clearCookies = [],
    map404ToJSON,
  } = opts;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (addAuth) {
    const token = getTokenFromCookies(req, tokenCookieNames);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (includeBody) {
    body = await buildBody(req, headers);
  }

  const upstream = await fetch(`${API}${upstreamPath}`, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  let res: NextResponse;

  // 404 -> mapear para JSON customizado (se configurado)
  if (upstream.status === 404 && map404ToJSON !== undefined) {
    res = NextResponse.json(map404ToJSON, { status: 200 });
  } else {
    const ct = upstream.headers.get("content-type") || "";

    // Status sem corpo
    if ([204, 205, 304].includes(upstream.status)) {
      res = new NextResponse(null, { status: upstream.status });
    } else if (ct.includes("application/json")) {
      const data = await upstream.json().catch(() => ({}));
      res = NextResponse.json(data, { status: upstream.status });
    } else {
      const text = await upstream.text().catch(() => "");
      res = new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": ct || "text/plain" },
      });
    }
  }

  // limpar cookies se solicitado
  if (clearCookies.length) {
    for (const c of clearCookies) {
      res.cookies.set(c, "", { expires: new Date(0), path: "/" });
    }
  }

  return res;
}

export const proxyGet = (req: NextRequest, path: string, opts?: ProxyOptions) =>
  proxy(req, "GET", path, { includeBody: false, ...opts });

export const proxyPost = (req: NextRequest, path: string, opts?: ProxyOptions) =>
  proxy(req, "POST", path, { includeBody: true, ...opts });

export const proxyPut = (req: NextRequest, path: string, opts?: ProxyOptions) =>
  proxy(req, "PUT", path, { includeBody: true, ...opts });

export const proxyPatch = (req: NextRequest, path: string, opts?: ProxyOptions) =>
  proxy(req, "PATCH", path, { includeBody: true, ...opts });

export const proxyDelete = (req: NextRequest, path: string, opts?: ProxyOptions) =>
  proxy(req, "DELETE", path, { includeBody: false, ...opts });
