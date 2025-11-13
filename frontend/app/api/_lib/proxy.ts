// app/api/_lib/proxy.ts
import { NextRequest, NextResponse } from "next/server"

const API_BASE =
  process.env.API_BASE_URL || process.env.BACKEND_API_BASE_URL || ""

/** nomes de cookies aceitos para o token; prioridade para "token" */
const TOKEN_COOKIE_NAMES = ["token", "access_token"]

/** extrai token do cookie do NextRequest */
function getTokenFromCookies(req: NextRequest): string | undefined {
  for (const n of TOKEN_COOKIE_NAMES) {
    const v = req.cookies.get(n)?.value
    if (v) return v
  }
  return undefined
}

/** clona headers do request original e aplica extras, removendo headers problemáticos */
function forwardHeaders(req: NextRequest, extra?: HeadersInit) {
  const h = new Headers(req.headers)

  // headers que não devem ser reaproveitados diretamente
  h.delete("host")
  h.delete("content-length")

  // injeta Authorization a partir do cookie, caso não exista
  const token = getTokenFromCookies(req)
  if (token && !h.has("authorization")) {
    h.set("authorization", `Bearer ${token}`)
  }

  // aplica sobrescritas/adições do caller
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v !== undefined && v !== null) h.set(k, String(v))
    }
  }

  return h
}

/**
 * Proxy base:
 * - por padrão usa o método do req original
 * - se init.body NÃO for passado, envia o stream original (req.body)
 * - não toca em Content-Type, a menos que init.headers defina (útil para JSON)
 * - usa duplex: "half" para streaming no Node
 */
async function proxy(req: NextRequest, path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`
  const headers = forwardHeaders(req, init?.headers as HeadersInit | undefined)

  const res = await fetch(url, {
    method: init?.method ?? req.method,
    headers,
    body:
      init && "body" in init
        ? (init.body as any) // body explícito (ex.: JSON stringificado)
        : ((req.body as any) ?? undefined), // stream original (multipart)
    // @ts-expect-error: necessário no Node para streaming do body
    duplex: "half",
    cache: "no-store",
  })

  // repassa headers/corpo/status do backend
  const respHeaders = new Headers(res.headers)
  // remove encodings que podem conflitar
  respHeaders.delete("content-encoding")
  respHeaders.delete("transfer-encoding")

  return new NextResponse(res.body, {
    status: res.status,
    headers: respHeaders,
  })
}

/** Helpers com semântica semelhante ao fetch */
export function proxyGet(req: NextRequest, path: string, p0?: { map404ToJSON: { items: never[]; total: number } }) {
  return proxy(req, path, { method: "GET" })
}

export function proxyDelete(req: NextRequest, path: string) {
  return proxy(req, path, { method: "DELETE" })
}

/**
 * Para JSON, passe o body já stringificado e o header content-type.
 * Para uploads (multipart), NÃO passe body aqui — chame só proxyPost(req, path).
 */
export function proxyPost(req: NextRequest, path: string, body?: BodyInit) {
  return proxy(
    req,
    path,
    body
      ? {
          method: "POST",
          body,
          headers: { "content-type": "application/json" },
        }
      : { method: "POST" } // sem body => usa req.body (stream)
  )
}

export function proxyPut(req: NextRequest, path: string, body?: BodyInit) {
  return proxy(
    req,
    path,
    body
      ? { method: "PUT", body, headers: { "content-type": "application/json" } }
      : { method: "PUT" }
  )
}

export function proxyPatch(req: NextRequest, path: string, body?: BodyInit) {
  return proxy(
    req,
    path,
    body
      ? {
          method: "PATCH",
          body,
          headers: { "content-type": "application/json" },
        }
      : { method: "PATCH" }
  )
}
