import { addToast } from "@heroui/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UpdateForumMessageInput {
  institutionId: string
  subjectId: string
  forumMessageId: string
  content: string
}

interface AppError extends Error {
  status?: number
}

export function useUpdateForumMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      forumMessageId,
      content,
    }: UpdateForumMessageInput) => {
      const res = await fetch(
        `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages/${forumMessageId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      )

      if (!res.ok) {
        const rawText = await res.text().catch(() => null)

        let message = `Falha ao atualizar mensagem do fórum (${res.status})`
        try {
          if (rawText) {
            const json = JSON.parse(rawText)
            if (json?.error?.message) {
              message = json.error.message
            }
          }
        } catch {
          // mantém o message default
        }

        const error: AppError = new Error(message)
        error.status = res.status
        throw error
      }

      return res.json()
    },

    onSuccess: (_data, variables) => {
      const { institutionId, subjectId } = variables

      queryClient.invalidateQueries({
        queryKey: ["forum-messages", institutionId, subjectId],
      })

      queryClient.invalidateQueries({
        queryKey: ["forum-messages-count", institutionId, subjectId],
      })
    },

    onError: (error) => {
      const err = error as AppError

      // 💡 Tratamento específico para 403 (tempo de edição expirado)
      if (err.status === 403) {
        addToast({
          variant: "bordered",
          color:"warning",
          title: "Não foi possível editar esta mensagem",
          description:
            "O prazo para edição desta mensagem já expirou. Você só pode editar mensagens logo após o envio.",
        })
        return
      }

      // Qualquer outro erro → mensagem genérica
      console.error("[useUpdateForumMessage] Erro ao atualizar:", err)

      addToast({
        variant: "bordered",
        color: "danger",
        title: "Erro ao editar mensagem",
        description:
          err.message ||
          "Ocorreu um erro ao tentar editar a mensagem. Tente novamente mais tarde.",
      })
    },
  })
}
