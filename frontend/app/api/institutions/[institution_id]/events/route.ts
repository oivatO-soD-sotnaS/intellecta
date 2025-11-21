// app/api/institutions/[institution_id]/events/route.ts
import { proxyGet } from "@/app/api/_lib/proxy"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string }>
}

/** Listar eventos institucionais */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id } = await ctx.params
  console.log(institution_id)

  return proxyGet(req, `/institutions/${institution_id}/events`)
}

/** Criar evento institucional */
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ institution_id: string }> }
) {
  const {
    title,
    description,
    event_start,
    event_end,
    event_type
  } = await req.json()

  const token = (await cookies()).get("token")?.value
  const { institution_id } = await ctx.params

  return fetch(`http://api.intellecta/institutions/${institution_id}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      description,
      event_start,
      event_end,
      event_type
    })
  });
}