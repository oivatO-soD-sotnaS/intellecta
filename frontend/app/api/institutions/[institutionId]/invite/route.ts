// app/api/institutions/[institutionId]/users/invite/route.ts
import { Params } from "next/dist/server/request/params"
import { NextResponse } from "next/server"
import type { NextRequest,  } from "next/server"

const API = process.env.API_BASE_URL

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const invites = await req.json() // { invites: string[] }
  const res = await fetch(
    `${API}/institutions/${params.institutionId}/users/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization")!,
      },
      body: JSON.stringify(invites),
    }
  )
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}
