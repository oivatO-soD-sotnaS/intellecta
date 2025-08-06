import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionSubjects } from "../../app/(locale)/(private)/institutions/[id]/services/institutionService"
import type { SubjectDto } from "../../app/(locale)/(private)/institutions/[id]/schema/subjectSchema"

export function useInstitutionSubjects(institutionId: string) {
  return useQuery<SubjectDto[], Error>({
    queryKey: ["institution", institutionId, "subjects"],
    queryFn: () => fetchInstitutionSubjects(institutionId),
    staleTime: 1000 * 60 * 5,
  })
}
