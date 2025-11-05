// app/api/institutions/[institution_id]/subjects/[subject_id]/events/[subject_event_id]/route.ts
import { proxyDelete, proxyGet, proxyPut } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{
    institution_id: string
    subject_id: string
    subject_event_id: string
  }>
}

/** Obter detalhes de um evento da disciplina */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id, subject_event_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/events/${subject_event_id}`
  )
}

/** Atualizar evento da disciplina */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id, subject_event_id } = await ctx.params
  return proxyPut(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/events/${subject_event_id}`
  )
}

/** Excluir evento da disciplina */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id, subject_event_id } = await ctx.params
  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/events/${subject_event_id}`
  )
}
