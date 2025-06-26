// app/api/sign-in/route.ts
/* eslint-disable no-console */
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // chama o backend
    const apiRes = await fetch(`${process.env.API_BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await apiRes.json()

    // prepara a resposta para o cliente
    const res = NextResponse.json(data, { status: apiRes.status })

    if (apiRes.ok && data.token) {
      // 1) cookie HttpOnly com o JWT
      res.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })

      // 2) extrai o sub (user_id) do payload do JWT
      try {
        const [, payload] = data.token.split(".")
        const decoded = JSON.parse(Buffer.from(payload, "base64").toString())
        const userId = decoded.sub as string

        // 3) cookie não-HttpOnly com o user_id
        res.cookies.set("user_id", userId, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      } catch (e) {
        console.warn("Não foi possível extrair user_id do token:", e)
      }
    }

    return res
  } catch (err: any) {
    console.error("Erro no proxy /api/sign-in:", err)

    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor de autenticação." },
      { status: 502 }
    )
  }
}
