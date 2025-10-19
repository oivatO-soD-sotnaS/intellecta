// lib/http.ts
import { cookies } from "next/headers"

const BASE = process.env.API_BASE_URL

if (!BASE) {
  console.warn(
    "API_BASE_URL/BACKEND_API_BASE_URL não definida. Defina no .env.local"
  )
}

function isFormData(x: any): x is FormData {
  return typeof FormData !== "undefined" && x instanceof FormData
}

export async function backendFetch(input: string, init?: RequestInit) {
  const jar = await cookies()


  const token =
    jar.get("token")?.value ?? jar.get("access_token")?.value ?? null

  console.log("Token Log -> ", token)


  const headers = new Headers(init?.headers)
  // Aceita JSON por padrão
  if (!headers.has("Accept")) headers.set("Accept", "application/json")

  // Define Content-Type só se houver body e NÃO for FormData
  const hasBody = typeof init?.body !== "undefined" && init?.body !== null
  if (hasBody && !headers.has("Content-Type") && !isFormData(init?.body)) {
    headers.set("Content-Type", "application/json")
  }

  // Injeta Authorization se ainda não veio e existir token
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${BASE}${input}`, {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    let data: any
    try {
      data = text ? JSON.parse(text) : undefined
    } catch {
      data = { message: text || res.statusText }
    }
    const err = new Error(data?.message || `HTTP ${res.status}`) as Error & {
      status?: number
      data?: any
    }
    err.status = res.status
    err.data = data
    throw err
  }

  if (res.status === 204) return null

  return res.json()
}
