/* eslint-disable no-console */
// app/api/users/upload-profile-picture/route.ts
import { NextRequest, NextResponse } from "next/server"

export const config = {
  api: {
    // Precisamos do FormData puro
    bodyParser: false,
  },
}

const API_URL = process.env.API_BASE_URL

if (!API_URL) {
  throw new Error(" process.env.API_BASE_URL não está definida")
}

export async function POST(req: NextRequest) {
  try {
    // 1) Captura o JWT do cookie, se houver
    const token = req.cookies.get("token")?.value

    // 2) Lê o FormData vindo do client
    const formData = await req.formData()

    // 3) Monta os headers que realmente importam
    const headers = new Headers()

    if (token) headers.set("Authorization", `Bearer ${token}`)

    // 4) Repassa o POST ao seu backend PHP sem o content-length “congelado”
    const upstream = await fetch(`${API_URL}/users/upload-profile-picture`, {
      method: "POST",
      headers,
      body: formData,
    })

    // 5) Se não for JSON, captura o texto bruto pra debug
    const contentType = upstream.headers.get("content-type") || ""

    if (!contentType.includes("application/json")) {
      const raw = await upstream.text()

      return NextResponse.json(
        { error: "Resposta não-JSON do servidor", raw },
        { status: upstream.status }
      )
    }

    // 6) Analisa o JSON e devolve pro front
    const data = await upstream.json()

    return NextResponse.json(data, { status: upstream.status })
  } catch (err: any) {
    // Falha na rede, desbloqueio do bodyParser, etc
    console.error("[upload-profile-picture proxy]", err)

    return NextResponse.json(
      { error: err.message || "Erro inesperado no proxy" },
      { status: 502 }
    )
  }
}
