// app/api/institutions/[institution_id]/classes/[class_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/classes/${class_id}`)
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params

  const body = await req.json().catch(() => ({}) as any)
  const newBody = JSON.stringify({ ...body, institution_id })

  const headers = new Headers(req.headers)
  if (!headers.has("content-type"))
    headers.set("content-type", "application/json")

  const forwarded = new NextRequest(req.url, {
    method: "PUT",
    headers,
    body: newBody,
  })

  return proxyPut(
    forwarded,
    `/institutions/${institution_id}/classes/${class_id}`
  )
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params
  return proxyDelete(req, `/institutions/${institution_id}/classes/${class_id}`)
}
