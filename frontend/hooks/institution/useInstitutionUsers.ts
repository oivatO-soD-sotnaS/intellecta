// hooks/institution/useInstitutionUsers.ts
import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionUsers } from "../../app/(locale)/(private)/institutions/[id]/services/institutionUsersService"
import type { InstitutionUserDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionUserSchema"

export function useInstitutionUsers(id: string) {
  return useQuery<InstitutionUserDto[], Error>({
    queryKey: ["institution", id, "users"],
    queryFn: () => fetchInstitutionUsers(id),
    enabled: !!id,
    placeholderData: [],
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
