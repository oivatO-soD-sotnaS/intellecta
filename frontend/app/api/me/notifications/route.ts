// app/api/me/notifications/route.ts
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

const BACKEND_URL = process.env.API_BASE_URL

export async function GET(request: NextRequest) {
  const token = (await cookies()).get("token")?.value

  // Repassa a requisição diretamente para o backend
  return fetch(`${BACKEND_URL}/users/me/notifications${request.nextUrl.search}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}