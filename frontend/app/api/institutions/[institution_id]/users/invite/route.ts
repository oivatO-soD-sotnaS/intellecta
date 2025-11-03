import { NextRequest } from "next/server"
import { proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string }> }
) {
  const { institution_id } = await ctx.params
  const res = await proxyPost(
    req,
    `/institutions/${institution_id}/users/invite`
  )

  if (!res.ok) {
    const clone = res.clone()
    let body = ""
    try {
      body = await clone.text()
    } catch {}
    console.error(
      "[INVITE PROXY] Upstream error:",
      res.status,
      body?.slice(0, 500)
    )
  }

  return res
}
