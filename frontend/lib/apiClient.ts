// lib/apiClient.ts
export type ApiClientOpts = RequestInit & {
  json?: any
  query?: Record<string, any>
}

function buildUrl(path: string, query?: Record<string, any>) {
  const url = path.startsWith("/") ? path : `/${path}`
  if (!query || Object.keys(query).length === 0) return url

  const u = new URL(
    url,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  )
  const params = new URLSearchParams(u.search)
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue
    if (Array.isArray(v)) v.forEach((item) => params.append(k, String(item)))
    else params.set(k, String(v))
  }
  u.search = params.toString()
  return u.pathname + (u.search ? `?${u.search}` : "")
}

function isFormData(x: any): x is FormData {
  return typeof FormData !== "undefined" && x instanceof FormData
}

async function handle<T = any>(path: string, opts?: ApiClientOpts): Promise<T> {
  const url = buildUrl(path, opts?.query)

  const headers = new Headers(opts?.headers)
  if (!headers.has("Accept")) headers.set("Accept", "application/json")

  let body: BodyInit | undefined = opts?.body
  if (opts?.json !== undefined) {
    body = JSON.stringify(opts.json)
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json")
  }

  // Se for FormData, NÃO setar Content-Type manualmente
  if (isFormData(body)) headers.delete("Content-Type")

  const init: RequestInit = {
    method: opts?.method ?? (opts?.json || opts?.body ? "POST" : "GET"),
    credentials: "include", 
    cache: "no-store",
    ...opts,
    headers,
    body,
  }

  const res = await fetch(url, init)

  

  if (res.status === 204) return null as T

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")

  if (!res.ok) {
    let data: any = undefined
    try {
      data = isJson ? await res.json() : await res.text()
      if (!isJson && typeof data === "string") {
        data = { message: data || res.statusText }
      }
    } catch {
      data = { message: res.statusText }
    }
    const err: any = new Error(data?.message || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }

  return (isJson ? res.json() : (res.text() as any)) as Promise<T>
}

export const apiGet = <T = any>(
  path: string,
  opts?: Omit<ApiClientOpts, "method" | "json" | "body">
) => handle<T>(path, { ...opts, method: "GET" })

export const apiPost = <T = any>(
  path: string,
  body?: any,
  opts?: Omit<ApiClientOpts, "method">
) => handle<T>(path, { ...opts, method: "POST", json: body, body: undefined })

export const apiPut = <T = any>(
  path: string,
  body?: any,
  opts?: Omit<ApiClientOpts, "method">
) => handle<T>(path, { ...opts, method: "PUT", json: body, body: undefined })

export const apiPatch = <T = any>(
  path: string,
  body?: any,
  opts?: Omit<ApiClientOpts, "method">
) => handle<T>(path, { ...opts, method: "PATCH", json: body, body: undefined })

export const apiDelete = <T = any>(
  path: string,
  opts?: Omit<ApiClientOpts, "method" | "json">
) => handle<T>(path, { ...opts, method: "DELETE" })

export const apiFetch = handle
