import { NextRequest } from "next/server"
import { cookies } from "next/headers"

const backendBaseUrl = process.env.API_BASE_URL

export async function PUT(
  req: NextRequest,
  ctx: {
    params: Promise<{
      institution_id: string
      subject_id: string
      forum_message_id: string
    }>
  }
) {
  const { institution_id, subject_id, forum_message_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const baseUrl = backendBaseUrl

  if (!baseUrl) {
    return new Response(
      JSON.stringify({ message: "API_BASE_URL não configurada" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }

  const backendUrl = `${baseUrl}/institutions/${institution_id}/subjects/${subject_id}/forum/messages/${forum_message_id}`

  try {
    // corpo esperado: { content: "..." }
    let jsonBody: unknown = null
    try {
      jsonBody = await req.json()
    } catch {
      jsonBody = null
    }

    const bodyString = jsonBody ? JSON.stringify(jsonBody) : null

    // tenta primeiro PUT, se backend responder 405, tenta PATCH
    const methodsToTry: ("PUT" | "PATCH")[] = ["PUT", "PATCH"]
    let backendResponse: Response | null = null

    for (const method of methodsToTry) {
      backendResponse = await fetch(backendUrl, {
        method,
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: bodyString,
      })

      // se não for 405, aceitamos esse resultado
      if (backendResponse.status !== 405) {
        break
      }
    }

    if (!backendResponse) {
      return new Response(
        JSON.stringify({ message: "Falha ao comunicar com o backend" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      )
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
    console.error("[ForumMessages API] Erro ao atualizar mensagem:", error)

    return new Response(
      JSON.stringify({ message: "Erro ao comunicar com o backend" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    )
  }
}
