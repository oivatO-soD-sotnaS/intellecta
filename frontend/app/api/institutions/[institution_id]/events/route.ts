// app/api/institutions/[institution_id]/events/route.ts
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string }>
}

/** Listar eventos institucionais */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/events`)
}

/** Criar evento institucional */
export async function POST(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  return proxyPost(req, `/institutions/${institution_id}/events`)
}
