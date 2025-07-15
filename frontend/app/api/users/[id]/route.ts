// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_BASE_URL!

if (!API) throw new Error("API_BASE_URL não definida")

async function proxyToPHP(
  req: NextRequest,
  method: "GET" | "PUT" | "DELETE",
  path: string,
  includeBody = false
): Promise<NextResponse> {
  const headers: Record<string, string> = {}
  const token = req.cookies.get("token")?.value

  if (token) headers["Authorization"] = `Bearer ${token}`
  if (includeBody) headers["Content-Type"] = "application/json"

  const init: RequestInit = { method, headers }

  if (includeBody) {
    const body = await req.json()

    init.body = JSON.stringify(body)
  }

  const upstream = await fetch(`${API}${path}`, init)
  const contentType = upstream.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const data = await upstream.json()

    return NextResponse.json(data, { status: upstream.status })
  }

  const text = await upstream.text()

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "text/plain" },
  })
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  return proxyToPHP(req, "GET", `/users/${id}`)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  return proxyToPHP(req, "PUT", `/users/${id}`, true)
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  return proxyToPHP(req, "DELETE", `/users/${id}`)
}
