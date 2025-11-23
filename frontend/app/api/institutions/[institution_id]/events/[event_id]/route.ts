// app/api/institutions/[institution_id]/events/[event_id]/route.ts
import { proxyGet } from "@/app/api/_lib/proxy";
import { cookies } from "next/headers";
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string; event_id: string }>
}

/** Obter detalhes de um evento institucional */
export async function GET(req: NextRequest, ctx: Ctx) {
  const { institution_id, event_id } = await ctx.params
  return proxyGet(req, `/institutions/${institution_id}/events/${event_id}`)
}

export async function DELETE(
  _: NextRequest,
  ctx: Ctx
) {
  const { event_id, institution_id } = await ctx.params
  const token = (await cookies()).get("token")?.value

  return fetch(`http://api.intellecta/institutions/${institution_id}/events/${event_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export async function PUT(
  req: NextRequest,
  ctx: Ctx
) {
  const {
    title,
    description,
    event_start,
    event_end,
    event_type
  } = await req.json()

  const token = (await cookies()).get("token")?.value
  const { event_id, institution_id } = await ctx.params

  return fetch(`http://api.intellecta/institutions/${institution_id}/events/${event_id}`, {
    method: "PUT",
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
