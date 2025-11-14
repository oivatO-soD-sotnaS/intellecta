// app/api/institutions/[institution_id]/summary/route.ts
import { NextRequest } from "next/server"
import { proxyGet } from "@/app/api/_lib/proxy"

export const dynamic = "force-dynamic"

type Params = {
  institution_id: string
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { institution_id } = await params

  return proxyGet(req, `/institutions/${institution_id}/summary`)
}
