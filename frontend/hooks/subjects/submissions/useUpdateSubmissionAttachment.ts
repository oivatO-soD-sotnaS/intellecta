// hooks/subjects/useUpdateSubmissionAttachment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPatch } from "@/lib/apiClient"
import type { SubmissionDTO } from "../types"

interface UpdateSubmissionAttachmentInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  submissionId: string
  attachmentId: string
}

interface UpdateSubmissionAttachmentResponse {
  message: string
  submission: SubmissionDTO
}

export function useUpdateSubmissionAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
      attachmentId,
    }: UpdateSubmissionAttachmentInput) =>
      apiPatch<UpdateSubmissionAttachmentResponse>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}/attachment`,
        { attachment_id: attachmentId }
      ),
    onSuccess(data, variables) {
      const { institutionId, subjectId, assignmentId, submissionId } = variables

      // Atualiza lista de submissões
      queryClient.invalidateQueries({
        queryKey: [
          "assignment-submissions",
          institutionId,
          subjectId,
          assignmentId,
        ],
      })

      // Atualiza detalhes da submissão específica
      queryClient.invalidateQueries({
        queryKey: [
          "submission",
          institutionId,
          subjectId,
          assignmentId,
          submissionId,
        ],
      })

      // Atualiza "minha submissão" se você usar isso
      queryClient.invalidateQueries({
        queryKey: ["my-submission", institutionId, subjectId, assignmentId],
      })

      return data
    },
  })
}
