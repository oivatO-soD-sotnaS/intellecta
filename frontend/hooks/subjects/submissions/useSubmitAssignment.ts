import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { SubmissionDTO } from "../types"

interface SubmitAssignmentInput {
  institutionId: string
  subjectId: string
  assignmentId: string
  attachment: File
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      institutionId,
      subjectId,
      assignmentId,
      attachment,
    }: SubmitAssignmentInput): Promise<SubmissionDTO> => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions`

      const formData = new FormData()
      formData.append("attachment", attachment)

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao enviar submissão (status ${response.status})`
        )
      }

      return response.json()
    },
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
