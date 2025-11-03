import { NextRequest } from "next/server"
import { proxyGet, proxyDelete } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      class_id: string
      class_users_id: string
    }>
  }
) {
  const { institution_id, class_id, class_users_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}/users/${class_users_id}`
  )
}

export async function DELETE(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      class_id: string
      class_users_id: string
    }>
  }
) {
  const { institution_id, class_id, class_users_id } = await ctx.params
  return proxyDelete(
    req,
    `/institutions/${institution_id}/classes/${class_id}/users/${class_users_id}`
  )
}
