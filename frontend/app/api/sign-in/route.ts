/* eslint-disable no-console */
// app/api/login/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const apiRes = await fetch(`${process.env.API_BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await apiRes.json()

    return NextResponse.json(data, { status: apiRes.status })
  } catch (err: any) {
    console.error("Erro no proxy /api/sign-in:", err)

    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor de autenticação." },
      { status: 502 }
    )
  }
}
