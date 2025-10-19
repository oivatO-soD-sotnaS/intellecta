// hooks/classes/useCreateClass.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"
import type { ClassDTO, CreateClassInput } from "@/types/class"

export function useCreateClass(institution_id: string) {
  const qc = useQueryClient()

  return useMutation<ClassDTO, any, CreateClassInput>({
    mutationFn: (payload) =>
      apiPost<ClassDTO>(
        `/api/institutions/${institution_id}/classes`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institution_id] })
    },
  })
}
