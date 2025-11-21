import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type RouteParams = {
  institution_id: string
  subject_id: string
  assignment_id: string
}

type Params = {
  params: Promise<RouteParams>
}

export async function GET(req: NextRequest, ctx: Params) {
  const { institution_id, subject_id, assignment_id } = await ctx.params

  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`
  )
}


export async function POST(req: NextRequest, ctx: Params) {
  const { institution_id, subject_id, assignment_id } = await ctx.params

  return proxyPost(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`
  )
}
