// app/api/v1/institutions/[institution_id]/subjects/[subject_id]/forum/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL

function buildBackendUrl(
  req: NextRequest,
  params: { institution_id: string; subject_id: string }
) {
  const url = new URL(
    `${API_BASE_URL}/institutions/${params.institution_id}/subjects/${params.subject_id}/forum/messages`
  )

  // repassa todos os query params (page, limit, content, created_at_from, created_at_to...)
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return url
}

async function getAuthHeader() {

  const token = (await cookies()).get("token")?.value

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function GET(
  req: NextRequest,
  context: { params: { institution_id: string; subject_id: string } }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL não configurada" },
      { status: 500 }
    )
  }

  const url = buildBackendUrl(req, context.params)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    // fórum é dinâmico, melhor não cachear
    cache: "no-store",
  })

  const data = await res
    .json()
    .catch(() => ({ error: "Invalid JSON response from backend" }))

  return NextResponse.json(data, { status: res.status })
}

export async function POST(
  req: NextRequest,
  context: { params: { institution_id: string; subject_id: string } }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "API_BASE_URL não configurada" },
      { status: 500 }
    )
  }

  const body = await req.json().catch(() => null)

  if (!body || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "Campo 'content' é obrigatório" },
      { status: 400 }
    )
  }

  const url = buildBackendUrl(req, context.params)

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: body.content }),
    cache: "no-store",
  })

  const data = await res
    .json()
    .catch(() => ({ error: "Invalid JSON response from backend" }))

  return NextResponse.json(data, { status: res.status })
}
