// hooks/class-subjects/useAddSubjectToClass.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"

type Payload = {
  subject_id: string
}

export function useAddSubjectToClass(institutionId: string, classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Payload) =>
      apiPost(
        `/api/institutions/${institutionId}/classes/${classId}/subjects`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", institutionId, classId],
      })
    },
  })
}
