// app/api/v1/institutions/[institution_id]/classes/[class_id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { backendFetch } from "@/lib/http"

export async function GET(
  _req: NextRequest,
  { params }: { params: { institution_id: string } }
) {
  const { institution_id } = params

  try {
    const data = await backendFetch(`/institutions/${institution_id}/classes`, {
      method: "GET",
    })
    return NextResponse.json(data)
  } catch (err: any) {
    if (err?.status === 404) {
      return NextResponse.json([], { status: 200 })
    }
    return NextResponse.json(
      { message: err?.message ?? "Erro ao listar turmas" },
      { status: err?.status ?? 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { institution_id: string; class_id: string } }
) {
  const { institution_id, class_id } = params
  const body = await req.json().catch(() => ({}))
  const data = await backendFetch(
    `/institutions/${institution_id}/classes/${class_id}`,
    { method: "PUT", body: JSON.stringify(body) }
  )
  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { institution_id: string; class_id: string } }
) {
  const { institution_id, class_id } = params
  await backendFetch(`/institutions/${institution_id}/classes/${class_id}`, {
    method: "DELETE",
  })
  return new NextResponse(null, { status: 204 })
}