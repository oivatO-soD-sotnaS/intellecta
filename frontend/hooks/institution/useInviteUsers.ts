import { useMutation, useQueryClient } from "@tanstack/react-query"
import { inviteUsers } from "../../app/(locale)/(private)/institutions/[id]/services/institutionUsersService"

export function useInviteUsers(id: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string[]>({
    mutationFn: (invites) => inviteUsers(id, invites),
    onSuccess: () => {
      // Mantido conforme original
    },
  })
}
