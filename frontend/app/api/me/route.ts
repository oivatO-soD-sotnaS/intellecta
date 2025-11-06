// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE = process.env.API_BASE_URL 

async function buildAuthHeader() {
  const jar = await cookies()
  // Ajuste o(s) nome(s) abaixo para o seu cookie real
  const raw =
    jar.get("token")?.value

  if (!raw) return undefined
  return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`
}

async function proxyToMe(req: NextRequest, method: "GET" | "PUT" | "DELETE") {
  if (!API_BASE) {
    return NextResponse.json(
      { error: "API_BASE_URL não configurada" },
      { status: 500 }
    )
  }

  const url = `${API_BASE}/users/me`
  const headers: HeadersInit = {
    "content-type": "application/json",
  }

  const auth = await buildAuthHeader()
  if (auth) headers["authorization"] = auth

  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
  }

  if (method === "PUT") {
    // repassa o corpo como está (JSON)
    const body = await req.text()
    init.body = body
  }

  const upstream = await fetch(url, init)

  const contentType = upstream.headers.get("content-type") ?? "application/json"
  const text = await upstream.text()

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": contentType },
  })
}

export async function GET(req: NextRequest) {
  return proxyToMe(req, "GET")
}
export async function PUT(req: NextRequest) {
  return proxyToMe(req, "PUT")
}
export async function DELETE(req: NextRequest) {
  return proxyToMe(req, "DELETE")
}
