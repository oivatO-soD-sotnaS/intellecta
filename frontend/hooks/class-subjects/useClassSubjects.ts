// hooks/class-subjects/useClassSubjects.ts
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { ClassSubject } from "@/types/subjects"

export function useClassSubjects(institutionId: string, classId: string) {
  return useQuery({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-subjects", institutionId, classId],
    queryFn: () =>
      apiGet<ClassSubject[]>(
        `/api/institutions/${institutionId}/classes/${classId}/subjects`
      ),
    staleTime: 30_000,
  })
}
