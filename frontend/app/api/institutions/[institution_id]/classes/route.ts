// app/api/v1/institutions/[institution_id]/classes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { backendFetch } from "@/lib/http"

export async function GET(
  _req: NextRequest,
  { params }: { params: { institution_id: string } }
) {
  const { institution_id } = params
  const data = await backendFetch(`/institutions/${institution_id}/classes`, {
    method: "GET",
  })
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { institution_id: string } }
) {
  const { institution_id } = params
  const body = await req.json().catch(() => ({}))
  const data = await backendFetch(`/institutions/${institution_id}/classes`, {
    method: "POST",
    body: JSON.stringify(body),
  })
  return NextResponse.json(data)
}
