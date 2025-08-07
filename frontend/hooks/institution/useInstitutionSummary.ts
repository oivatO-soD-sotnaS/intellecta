// hooks/institution/useInstitutionSummary.ts
import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionSummary } from "../../app/(locale)/(private)/institutions/[id]/services/institutionService"
import type { InstitutionSummaryDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionSchema"

export function useInstitutionSummary(id: string) {
  return useQuery<InstitutionSummaryDto, Error>({
    queryKey: ["institution", id, "summary"],
    queryFn: () => fetchInstitutionSummary(id),
    staleTime: 1000 * 60 * 5,
  })
}
