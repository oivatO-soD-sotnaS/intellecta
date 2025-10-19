import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

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

  const body = await req.json().catch(() => ({}) as any)
  const newBody = JSON.stringify({ ...body, institution_id })

  const headers = new Headers(req.headers)
  if (!headers.has("content-type"))
    headers.set("content-type", "application/json")

  const forwarded = new NextRequest(req.url, {
    method: "POST",
    headers,
    body: newBody,
  })

  return proxyPost(forwarded, `/institutions/${institution_id}/classes`)
}
