// app/api/files/upload-profile-assets/route.ts
import { NextRequest } from "next/server"
import { proxyPost } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs" // importante para streaming multipart

export async function POST(req: NextRequest) {
  // NÃO leia o body aqui; deixe o proxy repassar o stream (req.body)
  // Backend path conforme Swagger:
  return proxyPost(req, "/files/upload-profile-assets")
}
