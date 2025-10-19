// hooks/classes/mutations.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPut, apiDelete } from "@/lib/apiClient"
import type { ClassDTO, UpdateClassInput } from "@/types/class"

export function useUpdateClass(institutionId: string) {
  const qc = useQueryClient()

  return useMutation<
    ClassDTO,
    any,
    { classId: string; payload: UpdateClassInput }
  >({
    mutationFn: ({ classId, payload }) =>
      apiPut<ClassDTO>(
        `/api/institutions/${institutionId}/classes/${classId}`,
        payload
      ),
    onSuccess: (data, variables) => {
      // Atualiza detalhe e lista
      qc.invalidateQueries({
        queryKey: ["class", institutionId, variables.classId],
      })
      qc.invalidateQueries({
        queryKey: ["classes", institutionId],
      })
    },
  })
}

export function useDeleteClass(institutionId: string) {
  const qc = useQueryClient()

  return useMutation<void, any, string>({
    mutationFn: (classId) =>
      apiDelete<void>(
        `/api/institutions/${institutionId}/classes/${classId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
    },
  })
}
