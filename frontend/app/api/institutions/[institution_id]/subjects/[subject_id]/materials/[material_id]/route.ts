// app/api/institutions/[institution_id]/subjects/[subject_id]/materials/[material_id]/route.ts
import { NextRequest } from "next/server"
import { proxyGet, proxyPut, proxyDelete } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers"

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

  const backendUrl = `${baseUrl}/institutions/${institution_id}/subjects/${subject_id}/materials/${material_id}`

  try {
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
  } catch (error) {
    console.error("[Material API] Erro ao buscar material:", error)

    return new Response(
      JSON.stringify({ message: "Erro ao comunicar com o backend" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }
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

  const backendUrl = `${baseUrl}/institutions/${institution_id}/subjects/${subject_id}/materials/${material_id}`

  const contentType = req.headers.get("content-type") || ""

  let body: BodyInit | null = null
  let headers: HeadersInit = {}

  try {
    // 1) multipart/form-data → título + material_file (troca de anexo)
    if (contentType.includes("multipart/form-data")) {
      const incomingFormData = await req.formData()
      const forwardFormData = new FormData()

      incomingFormData.forEach((value, key) => {
        forwardFormData.append(key, value)
      })

      body = forwardFormData
      // não setamos content-type manual para multipart
    } else {
      // 2) JSON (atualização só de título)
      let jsonBody: unknown = null
      try {
        jsonBody = await req.json()
      } catch {
        jsonBody = null
      }

      body = jsonBody ? JSON.stringify(jsonBody) : null
      headers["content-type"] = "application/json"
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const methodsToTry: ("PUT" | "PATCH")[] = ["PUT", "PATCH"]
    let backendResponse: Response | null = null

    for (const method of methodsToTry) {
      backendResponse = await fetch(backendUrl, {
        method,
        headers,
        body,
      })

      if (backendResponse.status !== 405) {
        break
      }
    }

    if (!backendResponse) {
      throw new Error("Falha ao chamar backend para atualizar material")
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
  } catch (error) {
    console.error("[Material API] Erro ao atualizar material:", error)

    return new Response(
      JSON.stringify({ message: "Erro ao comunicar com o backend" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }
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
