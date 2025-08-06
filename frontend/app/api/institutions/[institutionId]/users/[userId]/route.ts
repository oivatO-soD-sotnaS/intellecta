// app/api/institutions/[institutionId]/users/[userId]/route.ts
import { Params } from "next/dist/server/request/params"
import { NextResponse } from "next/server"
import type { NextRequest,  } from "next/server"

const API = process.env.API_BASE_URL

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const res = await fetch(
    `${API}/institutions/${params.institutionId}/users/${params.userId}`,
    {
      method: "DELETE",
      headers: { Authorization: req.headers.get("Authorization")! },
    }
  )
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}
