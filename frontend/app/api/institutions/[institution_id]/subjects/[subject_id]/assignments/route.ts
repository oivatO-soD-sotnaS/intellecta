// app/api/institutions/[institution_id]/subjects/[subject_id]/assignments/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/assignments`
  )
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const backendBaseUrl = process.env.API_BASE_URL

  const backendUrl = `${backendBaseUrl}/institutions/${institution_id}/subjects/${subject_id}/assignments`

  const contentType = req.headers.get("content-type") || ""

  let backendResponse: globalThis.Response

  

  if (contentType.includes("multipart/form-data")) {
    const incomingFormData = await req.formData()

    const forwardFormData = new FormData()
    incomingFormData.forEach((value, key) => {
      forwardFormData.append(key, value)
    })

    console.log("log do forwardFormData -> ", forwardFormData)
    

    backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: forwardFormData,
    })

    
  } else {
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

  console.log("log do text -> ", text)
  

  return new Response(text, {
    status: backendResponse.status,
    headers: {
      "content-type":
        backendResponse.headers.get("content-type") ?? "application/json",
    },
  })
}
