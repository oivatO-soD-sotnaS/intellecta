import { NextRequest } from "next/server"
import { proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ invitation_id: string }> }
) {
  const { invitation_id } = await ctx.params

  //POST /invitations/{invitation_id}/accept
  return proxyPost(req, `/invitations/${invitation_id}/accept`)
}
