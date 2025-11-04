// app/api/institutions/[institution_id]/users/[institution_user_id]/change-role/route.ts
import { proxyPatch } from "@/app/api/_lib/proxy";
import { NextRequest } from "next/server"

type Ctx = {
  params: Promise<{ institution_id: string; institution_user_id: string }>
}

export async function PATCH(req: NextRequest, context: Ctx) {
  const { institution_id, institution_user_id } = await context.params
  return proxyPatch(
    req,
    `/institutions/${institution_id}/users/${institution_user_id}/change-role`
  )
}
