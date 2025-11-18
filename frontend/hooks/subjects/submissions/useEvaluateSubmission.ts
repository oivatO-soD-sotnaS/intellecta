// hooks/subjects/useEvaluateSubmission.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPost } from "@/lib/apiClient"
import type { SubmissionDTO } from "../types"

interface EvaluateSubmissionInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  submissionId: string
  concept?: string
  feedback?: string
}

export function useEvaluateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
      concept,
      feedback,
    }: EvaluateSubmissionInput) =>
      apiPost<SubmissionDTO>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}/evaluate`,
        { concept, feedback }
      ),
    onSuccess(_data, variables) {
      const { institutionId, subjectId, assignmentId, submissionId } = variables

      // Atualiza lista de submissões daquele assignment
      queryClient.invalidateQueries({
        queryKey: [
          "assignment-submissions",
          institutionId,
          subjectId,
          assignmentId,
        ],
      })

      // Atualiza detalhes da submissão
      queryClient.invalidateQueries({
        queryKey: [
          "submission",
          institutionId,
          subjectId,
          assignmentId,
          submissionId,
        ],
      })

      // Atualiza visão "minha submissão" do aluno
      queryClient.invalidateQueries({
        queryKey: ["my-submission", institutionId, subjectId, assignmentId],
      })
    },
  })
}
