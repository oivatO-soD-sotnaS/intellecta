/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, type NextRequest } from "next/server"

const API = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // decode sub from JWT or call /auth/me if exists
  // here we proxy to /users/:id
  try {
    // parse JWT to extract user_id
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const { sub } = JSON.parse(Buffer.from(base64, "base64").toString())

    const res = await fetch(`${API}/users/${sub}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()

    // console.log(data);
    

    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 })
  }
}
