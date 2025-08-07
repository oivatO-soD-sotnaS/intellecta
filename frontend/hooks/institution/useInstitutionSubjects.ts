import { useQuery } from "@tanstack/react-query"
import { fetchInstitutionSubjects } from "../../app/(locale)/(private)/institutions/[id]/services/institutionService"
import type { SubjectDto } from "../../app/(locale)/(private)/institutions/[id]/schema/subjectSchema"

export function useInstitutionSubjects(id: string) {
  return useQuery<SubjectDto[], Error>({
    queryKey: ["institution", id, "subjects"],
    queryFn: () => fetchInstitutionSubjects(id),
    staleTime: 1000 * 60 * 5,
  })
}
