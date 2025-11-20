// app/api/me/route.ts
import { NextRequest } from "next/server"
import { proxyGet } from "../../_lib/proxy";
import { cookies } from "next/headers";


export async function GET(req: NextRequest) {
  return proxyGet(req, "/users/me/events");
}

export async function POST(req: NextRequest) {
  const {
    title,
    description,
    event_start,
    event_end,
    event_type
  } = await req.json()
    
  const token = (await cookies()).get("token")?.value

  return fetch("http://api.intellecta/users/me/events", {
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
