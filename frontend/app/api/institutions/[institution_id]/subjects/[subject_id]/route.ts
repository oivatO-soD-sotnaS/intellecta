// app/api/institutions/[institution_id]/subjects/[subject_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"

type Params = { institution_id: string; subject_id: string }

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, subject_id } = await context.params

  return proxyGet(req, `/institutions/${institution_id}/subjects/${subject_id}`)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, subject_id } = await context.params
  const body = await req.json()

  return proxyPut(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}`,
    JSON.stringify(body)
  )
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, subject_id } = await context.params

  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}`
  )
}
