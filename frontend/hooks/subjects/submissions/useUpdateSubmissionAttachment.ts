import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SubmissionDTO } from "../types"

export interface UpdateSubmissionAttachmentInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  submissionId: string
  attachment: File
}

export function useUpdateSubmissionAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
      attachment,
    }: UpdateSubmissionAttachmentInput): Promise<SubmissionDTO> => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}/attachment`

      const formData = new FormData()
      formData.append("attachment", attachment)

      const response = await fetch(url, {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao atualizar anexo da submissão (status ${response.status})`
        )
      }

      return response.json()
    },
    onSuccess(_data, variables) {
      const { institutionId, subjectId, assignmentId } = variables

      // Lista de submissões (visão professor)
      queryClient.invalidateQueries({
        queryKey: [
          "assignment-submissions",
          institutionId,
          subjectId,
          assignmentId,
        ],
      })

      // “Minha submissão” desse aluno para essa atividade
      queryClient.invalidateQueries({
        queryKey: ["my-submission", institutionId, subjectId, assignmentId],
      })
    },
  })
}
