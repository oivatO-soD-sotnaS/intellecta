// hooks/invitations/useAcceptInvitation.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"

/**
 * Mutation para aceitar um convite.
 * Exemplo de uso:
 *
 * const { mutateAsync: accept, isPending } = useAcceptInvitation()
 * await accept(invitationId)
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["accept-invitation"],
    mutationFn: async (invitationId: string) => {
      // POST /api/invitations/{id}/accept  (rota proxy)
      return apiPost(`/api/invitations/${invitationId}/accept`)
    },
    onSuccess: (_data, invitationId) => {
      // Atualiza cache do convite específico e da lista
      queryClient.invalidateQueries({ queryKey: ["invitation", invitationId] })
      queryClient.invalidateQueries({ queryKey: ["invitations"] })
    },
  })
}
