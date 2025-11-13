// hooks/invitations/useInvitation.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { InvitationDTO } from "@/types/invitation"

/**
 * Busca detalhes de um convite específico pelo ID/token.
 * Usado, por exemplo, na página /invitation/accept?token=...
 */
export function useInvitation(invitationId?: string) {
  return useQuery({
    queryKey: ["invitation", invitationId],
    enabled: Boolean(invitationId),
    staleTime: 60_000,
    queryFn: async () =>
      apiGet<InvitationDTO>(`/api/invitations/${invitationId}`),
  })
}
