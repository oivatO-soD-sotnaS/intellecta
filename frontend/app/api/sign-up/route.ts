/* eslint-disable no-console */
// app/api/sign-up/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { full_name, email, password } = await request.json()

    const apiRes = await fetch(`${process.env.API_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    })

    const data = await apiRes.json()

    return NextResponse.json(data, { status: apiRes.status })
  } catch (err: any) {
    console.error("Erro no proxy /api/sign-up:", err)

    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor de cadastro." },
      { status: 502 }
    )
  }
}
