"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPut } from "@/lib/apiClient"
import { UpdateForumMessageInput } from "./useCreateForumMessage"
import { ForumMessageDTO } from "@/types/forum"

/**
 * Hook para atualizar mensagem do fórum
 * (backend só permite alteração até 15 minutos depois da criação)
 * proxy: PUT /api/institutions/[institution_id]/subjects/[subject_id]/forum/messages/[forum_message_id]
 */
export function useUpdateForumMessage(
  institutionId?: string,
  subjectId?: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateForumMessageInput) => {
      const { forumMessageId, content } = input

      if (!institutionId || !subjectId) {
        throw new Error("institutionId e subjectId são obrigatórios")
      }
      if (!forumMessageId) {
        throw new Error("forumMessageId é obrigatório")
      }

      const data = await apiPut<ForumMessageDTO>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages/${forumMessageId}`,
        { content }
      )

      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["forum-messages", institutionId, subjectId],
      })
      queryClient.invalidateQueries({
        queryKey: ["forum-messages-count", institutionId, subjectId],
      })

      // queryClient.invalidateQueries({
      //   queryKey: ["forum-message", variables.forumMessageId],
      // })
    },
  })
}
