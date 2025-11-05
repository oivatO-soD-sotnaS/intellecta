// app/api/institutions/[institution_id]/events/[event_id]/route.ts
import { proxyDelete, proxyGet, proxyPut } from "@/app/api/_lib/proxy";
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string; event_id: string }>
}

/** Obter detalhes de um evento institucional */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, event_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/events/${event_id}`)
}

/** Atualizar evento institucional */
export async function PUT(req: NextRequest, ctx: Ctx) {
  const { institution_id, event_id } = await ctx.params
  return proxyPut(req, `/institutions/${institution_id}/events/${event_id}`)
}

/** Excluir evento institucional */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { institution_id, event_id } = await ctx.params
  return proxyDelete(req, `/institutions/${institution_id}/events/${event_id}`)
}
