"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiDelete } from "@/lib/apiClient"

export function useDeleteInstitution(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => apiDelete<unknown>(`/api/institutions/${institutionId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institutions"] })
      qc.invalidateQueries({ queryKey: ["institutions", "owned"] })
      qc.invalidateQueries({ queryKey: ["institution", institutionId] })
      qc.invalidateQueries({
        queryKey: ["institution", institutionId, "summary"],
      })
    },
  })
}
