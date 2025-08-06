// app/api/institutions/[institutionId]/users/[userId]/change-role/route.ts
import { Params } from "next/dist/server/request/params"
import { NextResponse } from "next/server"
import type { NextRequest,  } from "next/server"

const API = process.env.API_BASE_URL

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { new_role } = await req.json() // { new_role: "teacher" }
  const res = await fetch(
    `${API}/institutions/${params.institutionId}/users/${params.userId}/change-role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization")!,
      },
      body: JSON.stringify({ new_role }),
    }
  )
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}
