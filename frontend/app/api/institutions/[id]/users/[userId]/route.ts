import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL!
if (!API_BASE_URL) throw new Error("API_BASE_URL não definida")

interface Params {
  params: Promise<{ id: string; userId: string }>
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id, userId } = await params // aguarda o params com os dois IDs
  const res = await fetch(
    `${API_BASE_URL}/institutions/${id}/users/${userId}`,
    {
      method: "DELETE",
      headers: { Authorization: req.headers.get("Authorization")! },
    }
  )

  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}
