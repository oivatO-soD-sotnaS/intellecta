// app/api/institutions/[institution_id]/classes/[class_id]/subjects/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

type Params = {
  institution_id: string
  class_id: string
}

// Lista todas as subjects vinculadas à turma
export async function GET(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, class_id } = await context.params

  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects`
  )
}

// Adiciona uma subject à turma (body: { subject_id: string })
export async function POST(
  req: NextRequest,
  context: { params: Promise<Params> }
) {
  const { institution_id, class_id } = await context.params

  // repassa o JSON recebido para o backend
  const body = await req.text()

  return proxyPost(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects`,
    body
  )
}
