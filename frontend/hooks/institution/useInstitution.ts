// hooks/institution/useInstitution.ts
import { useQuery } from "@tanstack/react-query"
import { fetchInstitution } from "../../app/(locale)/(private)/institution/[id]/services/institutionService"
import type { InstitutionDto } from "../../app/(locale)/(private)/institution/[id]/schema/institutionSchema"

export function useInstitution(institutionId: string) {
  return useQuery<InstitutionDto, Error>({
    queryKey: ["institution", institutionId],
    queryFn: () => fetchInstitution(institutionId),
    staleTime: 1000 * 60 * 5, 
  })
}
