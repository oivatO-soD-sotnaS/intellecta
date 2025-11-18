// hooks/subjects/useSubmissionDetails.ts
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
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
      "submission",
      institutionId,
      subjectId,
      assignmentId,
      submissionId,
    ],
    enabled: Boolean(
      institutionId && subjectId && assignmentId && submissionId && enabled
    ),
    queryFn: async () =>
      apiGet<SubmissionDTO>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}/submissions/${submissionId}`
      ),
  })
}
