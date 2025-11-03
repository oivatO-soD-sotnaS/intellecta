"use client"

import { apiPostForm } from "@/lib/apiClient"
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

type InvitePayload = { invites: string[] }
type InvitePayloadForm = { invites: string[] }


export function useInviteUsers(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["invite-users", institutionId],
    mutationFn: async (emails: string[]) => {
      const form: InvitePayloadForm = { invites: emails }
      return apiPostForm(
        `/api/institutions/${institutionId}/users/invite`,
        form
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invitations", institutionId] })
    },
  })
}
