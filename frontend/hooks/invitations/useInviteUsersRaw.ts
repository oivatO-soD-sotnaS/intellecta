"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export type Role = "admin" | "teacher" | "student"

export type InviteInput = {
  email: string
  role: Role
}

export type InviteResponse = {
  invitation_id: string
  email: string
  role: Role
  expires_at: string
  accepted_at: string | null
  created_at: string
  institution_id: string
  invited_by: string
}

export function useInviteUsersRaw(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["invite-users", institutionId],
    mutationFn: async (invites: InviteInput[]) => {
      const res = await fetch(
        `/api/institutions/${institutionId}/users/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invites }),
        }
      )

      const text = await res.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || "Falha ao enviar convites."
        const err = new Error(msg) as any
        err.status = res.status
        err.data = data
        throw err
      }

      return data as InviteResponse[]
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations", institutionId] })
      qc.invalidateQueries({ queryKey: ["institution-users", institutionId] })
    },
  })
}
