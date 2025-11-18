"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"
import { CreateForumMessageInput } from "./useForumMessagesCount"
import { ForumMessageDTO } from "@/types/forum"

/**
 * Hook para criar mensagem no fórum (somente professor deve usar o form na UI)
 * proxy: POST /api/institutions/[institution_id]/subjects/[subject_id]/forum/messages
 */
export function useCreateForumMessage(
  institutionId?: string,
  subjectId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateForumMessageInput) => {
      if (!institutionId || !subjectId) {
        throw new Error("institutionId e subjectId são obrigatórios")
      }

      const data = await apiPost<ForumMessageDTO>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages`,
        {
          content: input.content,
        }
      )

      return data
    },
    onSuccess: (_data) => {
      // Recarregar lista e contagem
      queryClient.invalidateQueries({
        queryKey: ["forum-messages", institutionId, subjectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["forum-messages-count", institutionId, subjectId],
      })
    },
  })
}

export type UpdateForumMessageInput = {
  forumMessageId: string
  content: string
}
