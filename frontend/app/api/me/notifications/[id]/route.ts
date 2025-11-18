// app/api/me/notifications/route.ts
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

const BACKEND_URL = process.env.API_BASE_URL

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const token = (await cookies()).get("token")?.value
    const { id } = await params

    return fetch(`${BACKEND_URL}/users/me/notifications/${id}/set-as-seen`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}