// app/api/institutions/[institution_id]/subjects/[subject_id]/assignments/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments`
  )
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params
  return proxyPost(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments`
  )
}