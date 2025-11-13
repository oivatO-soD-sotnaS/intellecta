import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ invitation_id: string }> }
) {
  const { invitation_id } = await ctx.params

  //GET /invitations/{invitation_id}
  return proxyGet(req, `/invitations/${invitation_id}`)
}
