import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type Params = {
  params: {
    institution_id: string
    subject_id: string
    assignment_id: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id } = params

  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`
  )
}

export async function POST(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id } = params

  return proxyPost(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`
  )
}