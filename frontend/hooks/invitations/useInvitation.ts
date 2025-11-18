import { apiGet } from "@/lib/apiClient"
import { InvitationDTO } from "@/types/invitation"
import { useQuery } from "@tanstack/react-query"

export function useInvitation(invitationId?: string) {
  return useQuery({
    queryKey: ["invitation", invitationId],
    enabled: Boolean(invitationId),
    staleTime: 60_000,
    retry: (failureCount, error: any) => {
      const status =
        error?.status ?? error?.response?.status ?? error?.cause?.status

      // Não adianta ficar tentando se for 404 ou 403
      if (status === 404 || status === 403) return false

      return failureCount < 2
    },
    queryFn: async () =>
      apiGet<InvitationDTO>(`/api/invitations/${invitationId}`),
  })
}
