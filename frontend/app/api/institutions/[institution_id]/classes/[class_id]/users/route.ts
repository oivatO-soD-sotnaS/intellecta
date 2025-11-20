// app/api/institutions/[institution_id]/classes/[class_id]/users/route.ts

import {  proxyPost } from "@/app/api/_lib/proxy"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const API_BASE_URL = process.env.API_BASE_URL

type RouteParams = {
  params: Promise<{
    institution_id: string
    class_id: string
  }>
}

export async function GET(req: NextRequest, ctx: RouteParams) {
  const { institution_id, class_id } = await ctx.params

  const token = (await cookies()).get("token")?.value

  // DEBUG 1: ver se a rota está sendo chamada
  console.log("[ClassUsers API] GET HIT", {
    institution_id,
    class_id,
  })

  const search = req.nextUrl.searchParams.toString()
  const url =
    `${API_BASE_URL}/institutions/${institution_id}/classes/${class_id}/users` +
    (search ? `?${search}` : "")

  // DEBUG 2: ver a URL que vai pro backend
  console.log("[ClassUsers API] Fetching backend URL:", url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const contentType = res.headers.get("content-type") || ""
    let data: any = null

    if (contentType.includes("application/json")) {
      data = await res.json()
    } else {
      const text = await res.text()
      data = { message: text }
    }

    // DEBUG 3: ver status retornado pelo backend
    console.log("[ClassUsers API] Backend response status:", res.status)

    return NextResponse.json(data, { status: res.status })
  } catch (error: any) {
    console.error("[ClassUsers API] ERROR calling backend:", error)
    return NextResponse.json(
      { message: "Erro ao buscar usuários da turma", error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string; class_id: string }> }
) {
  const { institution_id, class_id } = await ctx.params
  return proxyPost(
    req,
    `/institutions/${institution_id}/classes/${class_id}/users`
  )
}
