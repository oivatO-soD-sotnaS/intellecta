// hooks/classes/mutations.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPut, apiDelete } from "@/lib/apiClient"
import type { ClassDTO, UpdateClassInput } from "@/types/class"

export function useUpdateClass(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      classId,
      payload,
    }: {
      classId: string
      payload: UpdateClassInput
    }) => {
      return apiPut(
        `/api/institutions/${institutionId}/classes/${classId}`,
        payload
      )
    },
    onSuccess: (_data, { classId }) => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
      qc.invalidateQueries({ queryKey: ["class", institutionId, classId] })
    },
  })
}

export function useDeleteClass(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (classId: string) => {
      await apiDelete(`/api/institutions/${institutionId}/classes/${classId}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
    },
  })
}