// app/api/institutions/[institution_id]/classes/[class_id]/subjects/[class_subject_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyDelete } from "@/app/api/_lib/proxy"

type Ctx = {
  params: Promise<{
    institution_id: string
    class_id: string
    class_subject_id: string
  }>
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, class_id, class_subject_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects/${class_subject_id}`
  )
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { institution_id, class_id, class_subject_id } = await ctx.params
  return proxyDelete(
    req,
    `/institutions/${institution_id}/classes/${class_id}/subjects/${class_subject_id}`
  )
}
