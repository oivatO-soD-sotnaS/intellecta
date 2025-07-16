// app/api/institutions/route.ts
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API = process.env.API_BASE_URL

export async function GET() {
  const token = (await cookies()).get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Agora chamamos o endpoint que retorna tudo: criado +Participado
    const res = await fetch(`${API}/institutions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar instituições." },
      { status: 500 }
    )
  }
}

// POST permanece inalterado, criando novas instituições
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()

  try {
    const res = await fetch(`${API}/institutions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar instituição." },
      { status: 500 }
    )
  }
}
