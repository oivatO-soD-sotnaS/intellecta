// hooks/subjects/submissions/useSubmissionDetails.ts
import { useQuery } from "@tanstack/react-query"
import type { SubmissionDTO } from "../types"

interface UseSubmissionDetailsOptions {
  institutionId?: string
  subjectId?: string
  assignmentId?: string
  submissionId?: string
  enabled?: boolean
}

export function useSubmissionDetails({
  institutionId,
  subjectId,
  assignmentId,
  submissionId,
  enabled = true,
}: UseSubmissionDetailsOptions) {
  return useQuery({
    queryKey: [
      "submission-details",
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
    ],
    enabled: Boolean(
      institutionId && subjectId && assignmentId && submissionId && enabled
    ),
    queryFn: async (): Promise<SubmissionDTO> => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}`

      const response = await fetch(url, {
        method: "GET",
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")

        throw new Error(
          errorText ||
            `Erro ao carregar detalhes da submissão (status ${response.status})`
        )
      }

      return response.json()
    },
  })
}
