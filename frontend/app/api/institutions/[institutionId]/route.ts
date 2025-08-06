// app/api/institutions/[institutionId]/route.ts
import { Params } from "next/dist/server/request/params"
import { NextResponse } from "next/server"
import type { NextRequest,  } from "next/server"

const API = process.env.API_BASE_URL

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const res = await fetch(`${API}/institutions/${params.institutionId}`, {
    headers: { Authorization: req.headers.get("Authorization")! },
  })
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const payload = await req.json()
  const res = await fetch(`${API}/institutions/${params.institutionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("Authorization")!,
    },
    body: JSON.stringify(payload),
  })
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const res = await fetch(`${API}/institutions/${params.institutionId}`, {
    method: "DELETE",
    headers: { Authorization: req.headers.get("Authorization")! },
  })
  const body = await res.json()
  return NextResponse.json(body, { status: res.status })
}
