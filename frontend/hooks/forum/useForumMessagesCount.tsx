"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { ForumMessagesFilters } from "@/types/forum"

/**
 * Hook para contar mensagens do fórum (útil para badge, etc.)
 * proxy: /api/institutions/[institution_id]/subjects/[subject_id]/forum/messages/count
 */
export function useForumMessagesCount(
  institutionId?: string,
  subjectId?: string,
  filters?: ForumMessagesFilters
) {
  return useQuery({
    queryKey: ["forum-messages-count", institutionId, subjectId, filters],
    enabled: !!institutionId && !!subjectId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!institutionId || !subjectId) {
        throw new Error("institutionId e subjectId são obrigatórios")
      }

      try {
        const data = await apiGet<{ count: number }>(
          `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages/count`,
          {
            query: filters,
          }
        )

        return data.count ?? 0
      } catch (err: any) {
        const status =
          err?.status ?? err?.response?.status ?? err?.cause?.status

        // se não houver mensagens, backend pode retornar 404
        if (status === 404) return 0

        throw err
      }
    },
  })
}

export type CreateForumMessageInput = {
  content: string
}
