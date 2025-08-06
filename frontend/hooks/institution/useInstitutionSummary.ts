// hooks/institution/useInstitutionSummary.ts
import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionSummary } from "../../app/(locale)/(private)/institutions/[id]/services/institutionService"
import type { InstitutionSummaryDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionSchema"

export function useInstitutionSummary(institutionId: string) {
  return useQuery<InstitutionSummaryDto, Error>({
    queryKey: ["institution", institutionId, "summary"],
    queryFn: () => fetchInstitutionSummary(institutionId),
    staleTime: 1000 * 60 * 5,
  })
}
