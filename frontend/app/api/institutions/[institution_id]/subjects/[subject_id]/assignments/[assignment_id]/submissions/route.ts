import { proxyGet } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

type Params = {
  params: Promise<{
    institution_id: string
    subject_id: string
    assignment_id: string
  }>
}

export async function GET(req: NextRequest, ctx: Params) {
  const { institution_id, subject_id, assignment_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const backendBaseUrl = process.env.API_BASE_URL
  const backendUrl = `${backendBaseUrl}/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`

  const backendResponse = await fetch(backendUrl, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // se o backend usar algo de content-type no GET, ele mesmo define
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

export async function POST(req: NextRequest, ctx: Params) {
  const { institution_id, subject_id, assignment_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const backendBaseUrl = process.env.API_BASE_URL
  const backendUrl = `${backendBaseUrl}/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions`

  const contentType = req.headers.get("content-type") || ""

  let backendResponse: globalThis.Response

  if (contentType.includes("multipart/form-data")) {
    // ➜ submissão via arquivo (FormData)
    const incomingFormData = await req.formData()

    const forwardFormData = new FormData()
    incomingFormData.forEach((value, key) => {
      forwardFormData.append(key, value)
    })

    backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: forwardFormData,
    })
  } else {
    // ➜ submissão via JSON (ex.: { attachment_id: "..." })
    let jsonBody: any = null
    try {
      jsonBody = await req.json()
    } catch {
      jsonBody = null
    }

    backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: jsonBody ? JSON.stringify(jsonBody) : null,
    })
  }

  const text = await backendResponse.text()

  return new Response(text, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  })
}
