import { NextRequest } from "next/server"
import { proxyGet, proxyPatch, proxyDelete } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      assignment_id: string
    }>
  }
) {
  const { institution_id, subject_id, assignment_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}`
  )
}

export async function PATCH(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      assignment_id: string
    }>
  }
) {
  const { institution_id, subject_id, assignment_id } = await ctx.params
  return proxyPatch(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}`
  )
}

export async function DELETE(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      assignment_id: string
    }>
  }
) {
  const { institution_id, subject_id, assignment_id } = await ctx.params
  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}`
  )
}