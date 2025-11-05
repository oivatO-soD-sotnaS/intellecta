// app/api/institutions/[institution_id]/subjects/[subject_id]/events/route.ts
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy";
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string; subject_id: string }>
}

/** Listar eventos da disciplina */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/events`
  )
}

/** Criar evento da disciplina */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id } = await ctx.params
  return proxyPost(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/events`
  )
}
