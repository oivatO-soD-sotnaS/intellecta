// hooks/subjects/submissions/useAssignmentSubmissions.ts
import { useQuery } from "@tanstack/react-query"
import type { SubmissionDTO } from "../types"

interface UseAssignmentSubmissionsOptions {
  institutionId?: string
  subjectId?: string
  assignmentId?: string
  enabled?: boolean
}

export function useAssignmentSubmissions({
  institutionId,
  subjectId,
  assignmentId,
  enabled = true,
}: UseAssignmentSubmissionsOptions) {
  return useQuery({
    queryKey: [
      "assignment-submissions",
      institutionId,
      subjectId,
      assignmentId,
    ],
    enabled: Boolean(institutionId && subjectId && assignmentId && enabled),
    queryFn: async (): Promise<SubmissionDTO[]> => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions`

      const response = await fetch(url, {
        method: "GET",
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")

        // Aqui é legal deixar a mensagem explícita
        throw new Error(
          errorText ||
            `Erro ao carregar submissões da atividade (status ${response.status})`
        )
      }

      return response.json()
    },
  })
}
