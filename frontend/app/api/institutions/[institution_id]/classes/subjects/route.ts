import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects`
  )
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params
  return proxyPost(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects`
  )
}
