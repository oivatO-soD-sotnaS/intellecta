"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"

export function useAddUsersToClass(institutionId: string, classId?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["add-class-users", institutionId, classId],
    mutationFn: async (userIds: string[]) => {
      // Backend espera: { "user_ids": ["..."] }
      return apiPost<{ message?: string }>(
        `/api/institutions/${institutionId}/classes/${classId}/users`,
        { user_ids: userIds }
      )
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-users", institutionId, classId],
      })
    },
  })
}
