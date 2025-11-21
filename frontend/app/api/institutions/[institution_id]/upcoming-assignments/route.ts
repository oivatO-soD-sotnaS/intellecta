// app/api/institutions/[institution_id]/events/route.ts
import { proxyGet } from "@/app/api/_lib/proxy"
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string }>
}

/** Listar eventos institucionais */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  console.log(institution_id)

  return proxyGet(req, `/institutions/${institution_id}/upcoming-assignments`)
}