import { NextRequest } from "next/server"
import { cookies } from "next/headers"

type Params = {
  params: {
    institution_id: string
    subject_id: string
    assignment_id: string
    submission_id: string
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { institution_id, subject_id, assignment_id, submission_id } = params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const backendBaseUrl = process.env.API_BASE_URL
  const backendUrl = `${backendBaseUrl}/institutions/${institution_id}/subjects/${subject_id}/assignments/${assignment_id}/submissions/${submission_id}/attachment`

  const contentType = req.headers.get("content-type") || ""

  let backendResponse: globalThis.Response

  if (contentType.includes("multipart/form-data")) {
    // recebemos multipart do client → reenviamos multipart pro backend
    const incomingFormData = await req.formData()

    const forwardFormData = new FormData()
    incomingFormData.forEach((value, key) => {
      forwardFormData.append(key, value)
    })

    backendResponse = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: forwardFormData,
    })
  } else {
    // a API do backend espera multipart, mas se chegar sem body
    backendResponse = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
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
