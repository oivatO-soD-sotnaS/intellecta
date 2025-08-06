import { useMutation, useQueryClient } from "@tanstack/react-query"
import { inviteUsers } from "../../app/(locale)/(private)/institution/[id]/services/institutionUsersService"

export function useInviteUsers(institutionId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string[]>({
    mutationFn: (invites) => inviteUsers(institutionId, invites),
    onSuccess: () => {
      // Mantido conforme original
    },
  })
}
