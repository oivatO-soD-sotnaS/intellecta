// hooks/subjects/useSubject.ts
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { Subject } from "@/types/subjects"

export function useSubject(institutionId: string, subjectId?: string) {
  return useQuery({
    enabled: Boolean(institutionId && subjectId),
    queryKey: ["subject", institutionId, subjectId],
    queryFn: () =>
      apiGet<Subject>(
        `/api/institutions/${institutionId}/subjects/${subjectId}`
      ),
    staleTime: 30_000,
  })
}
