"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export type InvitationCreated = {
  invitation_id: string
  email: string
  role: string | null
  token: string | null
  expires_at: string
  institution_id: string
  invited_by: string
}

export function useInviteUsersRaw(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["invite-users", institutionId],
    mutationFn: async (emails: string[]) => {
      const params = new URLSearchParams()
      emails.forEach((e) => params.append("invites[]", e))

      const res = await fetch(
        `/api/institutions/${institutionId}/users/invite`,
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
          body: params.toString(),
          cache: "no-store",
        }
      )

      const text = await res.text()
      let data: any = null
      try {
        data = text ? JSON.parse(text) : null
      } catch {
      }

      if (!res.ok) {
        const err: any = new Error(
          data?.message || data?.error || text || "Request failed"
        )
        err.status = res.status
        err.data = data ?? text
        throw err
      }

      return data as InvitationCreated[]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations", institutionId] })
    },
  })
}
