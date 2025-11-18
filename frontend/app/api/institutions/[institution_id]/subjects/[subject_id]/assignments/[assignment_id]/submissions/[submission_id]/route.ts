import { proxyDelete, proxyGet } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type Params = {
  params: {
    institution_id: string
    subject_id: string
    assignment_id: string
    submission_id: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id, submission_id } = params

  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions/${submission_id}`
  )
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id, submission_id } = params

  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions/${submission_id}`
  )
}
