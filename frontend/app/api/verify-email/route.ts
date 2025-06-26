// app/api/verify-email/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, verification_code } = await request.json()
    const apiRes = await fetch(
      `${process.env.API_BASE_URL}/auth/verify-account`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code }),
      }
    )
    const data = await apiRes.json()

    const res = NextResponse.json(data, { status: apiRes.status })

    if (apiRes.ok) {

      res.cookies.set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })

      res.cookies.set("user_id", data.user.user_id, {
        httpOnly: false, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return res
  } catch (err: any) {
    console.error("Erro proxy /api/verify-email:", err)

    return NextResponse.json(
      { error: "Não foi possível conectar ao servidor." },
      { status: 502 }
    )
  }
}
