// hooks/subjects/useDeleteSubmission.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiDelete } from "@/lib/apiClient"

interface DeleteSubmissionInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  submissionId: string
}

export function useDeleteSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
    }: DeleteSubmissionInput) =>
      apiDelete(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}`
      ),
    onSuccess(_data, variables) {
      const { institutionId, subjectId, assignmentId } = variables

      queryClient.invalidateQueries({
        queryKey: [
          "assignment-submissions",
          institutionId,
          subjectId,
          assignmentId,
        ],
      })

      queryClient.invalidateQueries({
        queryKey: ["my-submission", institutionId, subjectId, assignmentId],
      })
    },
  })
}
