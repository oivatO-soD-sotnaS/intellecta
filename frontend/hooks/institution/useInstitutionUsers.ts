// hooks/institution/useInstitutionUsers.ts
import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionUsers } from "../../app/(locale)/(private)/institutions/[id]/services/institutionUsersService"
import type { InstitutionUserDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionUserSchema"

export function useInstitutionUsers(institutionId: string) {
  return useQuery<InstitutionUserDto[], Error>({
    queryKey: ["institution", institutionId, "users"],
    queryFn: () => fetchInstitutionUsers(institutionId),
    staleTime: 1000 * 60 * 2,
  })
}
