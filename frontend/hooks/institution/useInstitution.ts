// hooks/institution/useInstitution.ts
import { useQuery } from "@tanstack/react-query"
import type { InstitutionDto } from "@/app/(locale)/(private)/institutions/[id]/schema/institutionSchema"
import { fetchInstitutionById } from "@/app/(locale)/(private)/institutions/[id]/services/institutionService"

export function useInstitution(id: string) {
  return useQuery<InstitutionDto, Error>({
    queryKey: ["institution", id],
    queryFn: () => fetchInstitutionById(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  })
}
