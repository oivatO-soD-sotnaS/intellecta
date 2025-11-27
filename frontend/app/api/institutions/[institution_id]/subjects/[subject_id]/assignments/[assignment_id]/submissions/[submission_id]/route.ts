import { proxyDelete, proxyGet } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"
import { cookies } from "next/headers"

type Params = {
  params: Promise<{
    institution_id: string
    subject_id: string
    assignment_id: string
    submission_id: string
  }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id, submission_id } = await params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const backendBaseUrl = process.env.API_BASE_URL
  const backendUrl = `${backendBaseUrl}/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions/${submission_id}`

  const backendResponse = await fetch(backendUrl, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const text = await backendResponse.text()

  return new Response(text, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  })
}

export async function DELETE(req: NextRequest, ctx: Params) {
  const { institution_id, subject_id, assignment_id, submission_id } =
    await ctx.params

  return proxyDelete(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions/${submission_id}`
  )
}
