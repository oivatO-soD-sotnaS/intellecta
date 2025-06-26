// app/api/users/[id]/route.ts
import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"

const API = process.env.API_BASE_URL

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.cookies.get("token")?.value
  const res = await fetch(`${API}/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const body = await req.json()
  const token = req.cookies.get("token")?.value
  const res = await fetch(`${API}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}

export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.cookies.get("token")?.value
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await res.json()

  return NextResponse.json(data, { status: res.status })
}
