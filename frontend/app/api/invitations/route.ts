import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  // GET /invitations
  return proxyGet(req, "/invitations")
}
