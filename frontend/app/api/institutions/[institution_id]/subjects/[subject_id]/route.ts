// app/api/institutions/[institution_id]/subjects/[subject_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut } from "@/app/api/_lib/proxy"

type Ctx = { params: Promise<{ institution_id: string; subject_id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/subjects/${subject_id}`)
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id } = await ctx.params
  return proxyPut(req, `/institutions/${institution_id}/subjects/${subject_id}`)
}
