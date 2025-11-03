// app/api/institutions/[institution_id]/subjects/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

type Ctx = { params: Promise<{ institution_id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/subjects`)
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  return proxyPost(req, `/institutions/${institution_id}/subjects`)
}
