import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeUserRole } from "../../app/(locale)/(private)/institutions/[id]/services/institutionUsersService"
import type { InstitutionUserDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionUserSchema"

export function useChangeUserRole(institutionId: string) {
  const qc = useQueryClient()
  return useMutation<
    InstitutionUserDto,
    Error,
    { userId: string; newRole: "admin" | "teacher" | "student" }
  >({
    mutationFn: ({ userId, newRole }) =>
      changeUserRole(institutionId, userId, newRole),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution", institutionId, "users"],
      })
    },
  })
}
