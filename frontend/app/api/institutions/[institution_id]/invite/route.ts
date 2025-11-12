// app/api/institutions/[id]/users/invite/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const API = process.env.API_BASE_URL
  if (!API) {
    return NextResponse.json(
      { error: "API_BASE_URL não configurada" },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "JSON inválido no corpo da requisição" },
      { status: 400 }
    )
  }

  // 2) Obtém o token (prioriza header, senão cookie)
  const hdrAuth = req.headers.get("authorization")
  const cookieStore = cookies()
  const tokenFromCookie = (await cookieStore).get("token")?.value || null

  const auth =
    hdrAuth ?? (tokenFromCookie ? `Bearer ${tokenFromCookie}` : undefined)

  const upstream = await fetch(
    `${API}/institutions/${params.id}/users/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: JSON.stringify(body),
    }
  )

  const text = await upstream.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }

  return NextResponse.json(data, { status: upstream.status })
}
