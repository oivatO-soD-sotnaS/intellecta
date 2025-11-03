// hooks/class-subjects/useRemoveSubjectFromClass.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiDelete } from "@/lib/apiClient"

export function useRemoveSubjectFromClass(
  institutionId: string,
  classId: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (class_subject_id: string) =>
      apiDelete(
        `/api/institutions/${institutionId}/classes/${classId}/subjects/${class_subject_id}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", institutionId, classId],
      })
    },
  })
}