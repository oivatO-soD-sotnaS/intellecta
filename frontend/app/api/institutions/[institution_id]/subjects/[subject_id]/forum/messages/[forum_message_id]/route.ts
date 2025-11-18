// app/api/institutions/[institution_id]/subjects/[subject_id]/forum/messages/[forum_message_id]/route.ts
import { NextRequest } from "next/server"
import { proxyPut } from "@/app/api/_lib/proxy"

type Ctx = {
  params: Promise<{
    institution_id: string
    subject_id: string
    forum_message_id: string
  }>
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { institution_id, subject_id, forum_message_id } = await ctx.params

  return proxyPut(
    req,
    `/institutions/${institution_id}/subjects/${subject_id}/forum/messages/${forum_message_id}`
  )
}
