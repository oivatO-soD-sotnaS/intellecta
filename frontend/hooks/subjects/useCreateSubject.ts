// hooks/subjects/useCreateSubject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"
import type { Subject } from "@/types/subjects"

type CreatePayload = {
  name: string
  description?: string
  teacher_id?: string
  profile_picture_id?: string
  banner_id?: string
}

export function useCreateSubject(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePayload) =>
      apiPost<{ message: string; subject: Subject }>(
        `/api/institutions/${institutionId}/subjects`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}
