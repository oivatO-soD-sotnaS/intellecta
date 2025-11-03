import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/users`)
}
