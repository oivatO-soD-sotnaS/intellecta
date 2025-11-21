// app/api/institutions/[institution_id]/subjects/[subject_id]/materials/route.ts
import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"

export async function GET(
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
    console.error("[Materials API] Erro ao buscar materiais:", error)

    return new Response(
      JSON.stringify({ message: "Erro ao comunicar com o backend" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }
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

  try {
    // Backend claramente espera multipart/form-data SEMPRE
    const incomingFormData = await req.formData()
    const forwardFormData = new FormData()

    incomingFormData.forEach((value, key) => {
      forwardFormData.append(key, value)
    })

    // Aqui poderíamos validar title / material_file, se quiser
    // const title = forwardFormData.get("title")
    // const file = forwardFormData.get("material_file")

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: forwardFormData,
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
