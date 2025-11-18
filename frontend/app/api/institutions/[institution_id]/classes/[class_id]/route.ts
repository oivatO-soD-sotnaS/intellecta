// app/api/institutions/[institution_id]/classes/[class_id]/route.ts

import { NextRequest } from "next/server"
import {
  proxyGet,
  proxyPut,
  proxyDelete,
} from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Params = {
  params: Promise<{ institution_id: string; class_id: string }>
}

// GET /institutions/{institution_id}/classes/{class_id}
// Obter detalhes da turma
export async function GET(req: NextRequest, ctx: Params) {
  const { institution_id, class_id } = await ctx.params

  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}`,
  )
}

// PUT /institutions/{institution_id}/classes/{class_id}
// Atualizar detalhes da turma
export async function PUT(req: NextRequest, ctx: Params) {
  const { institution_id, class_id } = await ctx.params

  // corpo já vem em JSON do frontend; repassamos como texto
  const body = await req.text()

  return proxyPut(
    req,
    `/institutions/${institution_id}/classes/${class_id}`,
    body,
  )
}

// DELETE /institutions/{institution_id}/classes/{class_id}
// Excluir turma
export async function DELETE(req: NextRequest, ctx: Params) {
  const { institution_id, class_id } = await ctx.params

  return proxyDelete(
    req,
    `/institutions/${institution_id}/classes/${class_id}`,
  )
}
