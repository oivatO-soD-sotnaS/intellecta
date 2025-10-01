// lib/http.ts
import { cookies } from "next/headers"

const BASE = process.env.BACKEND_API_BASE_URL

if (!BASE) {
  // Ajuda no dev se esquecer a env
  console.warn("BACKEND_API_BASE_URL não definida. Defina no .env.local")
}

export async function backendFetch(input: string, init?: RequestInit) {
  // Lê token do cookie (ajuste o nome caso o seu seja diferente)
  const token = (await cookies()).get("access_token")?.value

  const headers = new Headers(init?.headers)
  headers.set("Accept", "application/json")
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json")
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${BASE}${input}`, {
    ...init,
    headers,
    cache: "no-store",
  })

  // Normaliza erros HTTP
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    let data: any
    try {
      data = text ? JSON.parse(text) : undefined
    } catch {
      data = { message: text || res.statusText }
    }
    const err = new Error(data?.message || `HTTP ${res.status}`)
    ;(err as any).status = res.status
    ;(err as any).data = data
    throw err
  }

  // Pode vir 204 (sem body)
  if (res.status === 204) return null

  return res.json()
}
