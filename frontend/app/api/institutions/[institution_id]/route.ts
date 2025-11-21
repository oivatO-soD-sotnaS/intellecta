// app/api/institutions/[institution_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"

type RouteParams = {
  institution_id: string
}

type Params = {
  params: Promise<RouteParams>
}

export async function GET(req: NextRequest, ctx: Params) {
  const { institution_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}`)
}

export async function PUT(req: NextRequest, ctx: Params) {
  const {institution_id} = await ctx.params
  return proxyPut(req, `/institutions/${institution_id}`)
}

export async function DELETE(req: NextRequest, ctx: Params
) {
  const { institution_id } = await ctx.params

  return proxyDelete(req, `/institutions/${institution_id}`)
}
