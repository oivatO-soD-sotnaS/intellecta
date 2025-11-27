// app/api/institutions/[institution_id]/subjects/[subject_id]/forum/messages/route.ts
import { proxyPost } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_BASE_URL

type Ctx = {
  params: Promise<{ institution_id: string; subject_id: string }>
}

interface RouteParams {
  institution_id: string
  subject_id: string
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id } = await ctx.params

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const { searchParams } = req.nextUrl

  const backendUrl = new URL(
    `${API_BASE_URL}/institutions/${institution_id}/subjects/${subject_id}/forum/messages`
  )

  // repassa todos os query params (limit, offset, created_at_from, created_at_to, etc.)
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value)
  })

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  console.log(backendResponse)
  

  if (!backendResponse.ok) {
    const errorBody = await backendResponse.text()
    console.error(
      "[ForumMessages API] Backend error",
      backendResponse.status,
      errorBody
    )

    return new NextResponse(errorBody, {
      status: backendResponse.status,
      headers: { "content-type": "application/json" },
    })
  }

  const data = await backendResponse.json()

  return NextResponse.json(data)
}


export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; subject_id: string }> }
) {
  const { institution_id, subject_id } = await ctx.params

  // tenta ler o body como JSON (no caso do fórum é simples)
  let jsonBody: any = null
  try {
    jsonBody = await req.clone().json()
  } catch {
    jsonBody = null
  }

  console.log("[ForumMessages Proxy] Payload enviad o para o backend:", jsonBody)

  return proxyPost(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/forum/messages`
  )
}

