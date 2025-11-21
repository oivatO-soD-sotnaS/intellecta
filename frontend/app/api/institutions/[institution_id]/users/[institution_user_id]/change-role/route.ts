// app/api/institutions/[institution_id]/users/[institution_user_id]/change-role/route.ts
import { cookies } from "next/headers";
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string; institution_user_id: string }>
}

export async function PATCH(req: NextRequest, context: Ctx) {
  const { institution_id, institution_user_id } = await context.params
  const { role } = await req.json()
  const token = (await cookies()).get("token")?.value

  return fetch(`http://api.intellecta/institutions/${institution_id}/users/${institution_user_id}/change-role`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    },
    body: JSON.stringify({new_role: role})    
  })
}
