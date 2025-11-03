// hooks/subjects/useUpdateSubject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPut } from "@/lib/apiClient"
import type { Subject } from "@/types/subjects"

type UpdatePayload = Partial<
  Pick<Subject, "name" | "description" | "teacher_id">
> & {
  profile_picture_id?: string
  banner_id?: string
}

export function useUpdateSubject(institutionId: string, subjectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePayload) =>
      apiPut(
        `/api/institutions/${institutionId}/subjects/${subjectId}`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subject", institutionId, subjectId] })
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}