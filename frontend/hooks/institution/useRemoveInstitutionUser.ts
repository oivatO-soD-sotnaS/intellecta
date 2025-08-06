import { useMutation, useQueryClient } from "@tanstack/react-query"
import { removeInstitutionUser } from "../../app/(locale)/(private)/institutions/[id]/services/institutionUsersService"

export function useRemoveInstitutionUser(institutionId: string) {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (institutionUserId) =>
      removeInstitutionUser(institutionId, institutionUserId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution", institutionId, "users"],
      })
    },
  })
}
