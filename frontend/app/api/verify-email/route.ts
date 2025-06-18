// app/api/verify-email/route.ts
/* eslint-disable no-console */
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, verification_code } = await req.json()

    const apiRes = await fetch(
      `${process.env.API_BASE_URL}/auth/verify-account`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code }),
      }
    )
    const data = await apiRes.json()

    // Monta a resposta
    const res = NextResponse.json(data, { status: apiRes.status })

    // Se tiver token e for sucesso, seta cookie HTTP-Only
    if (apiRes.ok && data.token) {
      res.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias, ajuste se quiser
      })
    }

    return res
  } catch (e: any) {
    console.error("Erro proxy /api/verify-email:", e)

    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 }
    )
  }
}
