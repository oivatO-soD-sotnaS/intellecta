// hooks/forum/useForumMessages.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { ForumMessagesPageDTO, ForumMessagesQueryParams } from "@/types/forum"


/**
 * Hook para listar mensagens do fórum de uma disciplina
 * proxy: /api/institutions/[institution_id]/subjects/[subject_id]/forum/messages
 */
export function useForumMessages(
  institutionId?: string,
  subjectId?: string,
  params?: ForumMessagesQueryParams
) {
  return useQuery({
    queryKey: ["forum-messages", institutionId, subjectId, params],
    enabled: !!institutionId && !!subjectId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!institutionId || !subjectId) {
        throw new Error("institutionId e subjectId são obrigatórios")
      }

      try {
        const data = await apiGet<ForumMessagesPageDTO>(
          `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages`,
          {
            query: params,
          }
        )

        return data
      } catch (err: any) {
        const status =
          err?.status ?? err?.response?.status ?? err?.cause?.status

        // backend lança 404 quando não há mensagens; aqui mapeamos para lista vazia
        if (status === 404) {
          return {
            paging: {
              page: params?.page ?? 1,
              total_pages: 0,
              total_records: 0,
            },
            records: [],
          } satisfies ForumMessagesPageDTO
        }

        throw err
      }
    },
  })
}