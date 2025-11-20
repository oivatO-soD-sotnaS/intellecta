import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
    const { id } = await ctx.params
    const token = (await cookies()).get("token")?.value

    return fetch(`http://api.intellecta/users/me/events/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export async function PUT(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    const {
        title,
        description,
        event_start,
        event_end,
        event_type
    } = await req.json()
    
    console.log(event_start)
    console.log(event_end)

    const token = (await cookies()).get("token")?.value
    const { id } = await ctx.params

    return fetch(`http://api.intellecta/users/me/events/${id}`, {
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