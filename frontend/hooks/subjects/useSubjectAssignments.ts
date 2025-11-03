"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/apiClient"

export type AttachmentLite = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type Assignment = {
  assignment_id: string
  title: string
  description?: string
  deadline?: string
  subject_id: string
  attachment_id?: string
  attachment?: AttachmentLite | null
}

export function useSubjectAssignments(
  institutionId: string,
  subjectId?: string
) {
  return useQuery({
    enabled: Boolean(institutionId && subjectId),
    queryKey: ["subject-assignments", institutionId, subjectId],
    queryFn: () =>
      apiGet<Assignment[]>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments`
      ),
  })
}

export function useCreateAssignment(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["create-assignment", institutionId, subjectId],
    // Aceita tanto JSON quanto FormData (com arquivo)
    mutationFn: (payload: FormData | Record<string, any>) =>
      payload instanceof FormData
        ? apiPost(
            `/api/institutions/${institutionId}/subjects/${subjectId}/assignments`,
            payload
          )
        : apiPost(
            `/api/institutions/${institutionId}/subjects/${subjectId}/assignments`,
            payload
          ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-assignments", institutionId, subjectId],
      })
    },
  })
}

export function useUpdateAssignment(
  institutionId: string,
  subjectId?: string,
  assignmentId?: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["update-assignment", institutionId, subjectId, assignmentId],
    mutationFn: (payload: Partial<Assignment> | FormData) =>
      payload instanceof FormData
        ? apiPatch(
            `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}`,
            payload
          )
        : apiPatch(
            `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}`,
            payload
          ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-assignments", institutionId, subjectId],
      })
    },
  })
}

export function useDeleteAssignment(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["delete-assignment", institutionId, subjectId],
    mutationFn: (assignmentId: string) =>
      apiDelete(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-assignments", institutionId, subjectId],
      })
    },
  })
}
