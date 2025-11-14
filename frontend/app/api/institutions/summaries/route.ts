// app/api/institutions/summaries/route.ts
import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  // Deixa o proxy cuidar dos query params
  return proxyGet(req, "/institutions/summaries")
}
