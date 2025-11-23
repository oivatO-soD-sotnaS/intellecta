import { NextRequest } from "next/server"
import { proxyGet, proxyPost } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params
  return proxyGet(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/materials`
  )
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ message: "API_BASE_URL não configurada" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }

  const backendUrl = `${baseUrl}/institutions/${institution_id}/subjects/${subject_id}/materials`

  const contentType = req.headers.get("content-type") || ""
  let backendResponse: Response

  try {
    // 1) multipart/form-data → repassa como FormData
    if (contentType.includes("multipart/form-data")) {
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
      // 2) fallback: JSON (caso você queira mandar só title sem arquivo)
      let jsonBody: unknown = null
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
  } catch (error) {
    console.error("[Materials API] Erro ao criar material:", error)

    return new Response(
      JSON.stringify({ message: "Erro ao comunicar com o backend" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }
}

