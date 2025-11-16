// app/api/institutions/[institution_id]/classes/[class_id]/subjects/[class_subject_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyDelete } from "@/app/api/_lib/proxy"

type Params = {
  institution_id: string
  class_id: string
  class_subject_id: string
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, class_id, class_subject_id } = await context.params

  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects/${class_subject_id}`
  )
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, class_id, class_subject_id } = await context.params

  return proxyDelete(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects/${class_subject_id}`
  )
}
