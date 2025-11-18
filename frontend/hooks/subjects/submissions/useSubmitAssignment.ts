// hooks/subjects/useSubmitAssignment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"
import type { SubmissionDTO } from "../types"

interface SubmitAssignmentInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  // payload vai depender de como você está modelando o envio:
  // pode ser { attachment_id: string } ou FormData, etc.
  payload: any
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      payload,
    }: SubmitAssignmentInput) =>
      apiPost<SubmissionDTO>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions`,
        payload
      ),
    onSuccess(_data, variables) {
      const { institutionId, subjectId, assignmentId } = variables

      // Atualiza lista de submissões daquele assignment (visão professor)
      queryClient.invalidateQueries({
        queryKey: [
          "assignment-submissions",
          institutionId,
          subjectId,
          assignmentId,
        ],
      })

      // Se você criar um hook "my-submission", já deixa pronto:
      queryClient.invalidateQueries({
        queryKey: ["my-submission", institutionId, subjectId, assignmentId],
      })
    },
  })
}
