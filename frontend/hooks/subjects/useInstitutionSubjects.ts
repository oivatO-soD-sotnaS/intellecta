// hooks/subjects/useInstitutionSubjects.ts
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { Subject } from "@/types/subjects"

export function useInstitutionSubjects(institutionId: string) {
  return useQuery({
    enabled: Boolean(institutionId),
    queryKey: ["institution-subjects", institutionId],
    queryFn: () =>
      apiGet<Subject[]>(`/api/institutions/${institutionId}/subjects`),
    staleTime: 30_000,
  })
}
