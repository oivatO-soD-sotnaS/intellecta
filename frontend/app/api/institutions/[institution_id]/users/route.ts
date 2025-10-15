// app/api/institutions/[id]/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  return proxyGet(req, `/institutions/${id}/users`)
}
