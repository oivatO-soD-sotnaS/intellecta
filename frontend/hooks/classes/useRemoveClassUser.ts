"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiDelete } from "@/lib/apiClient"

export function useRemoveClassUser(institutionId: string, classId?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["remove-class-user", institutionId, classId],
    mutationFn: async (classUsersId: string) => {
      return apiDelete(
        `/api/institutions/${institutionId}/classes/${classId}/users/${classUsersId}`
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-users", institutionId, classId],
      })
    },
  })
}
