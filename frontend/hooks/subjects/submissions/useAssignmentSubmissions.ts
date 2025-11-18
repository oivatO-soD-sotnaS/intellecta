// hooks/subjects/useAssignmentSubmissions.ts
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
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
    queryFn: async () =>
      apiGet<SubmissionDTO[]>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions`
      ),
  })
}
