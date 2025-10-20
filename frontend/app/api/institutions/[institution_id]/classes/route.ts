import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs" // importante para streaming multipart

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/classes`)
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await ctx.params
  // ⚠️ NÃO leia o body aqui — precisamos repassar o stream multipart intacto
  return proxyPost(req, `/institutions/${institution_id}/classes`)
}
