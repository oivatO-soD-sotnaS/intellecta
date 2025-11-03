import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      material_id: string
    }>
  }
) {
  const { institution_id, subject_id, material_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/materials/${material_id}`
  )
}

export async function PUT(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      material_id: string
    }>
  }
) {
  const { institution_id, subject_id, material_id } = await ctx.params
  return proxyPut(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/materials/${material_id}`
  )
}

export async function DELETE(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      material_id: string
    }>
  }
) {
  const { institution_id, subject_id, material_id } = await ctx.params
  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/materials/${material_id}`
  )
}
