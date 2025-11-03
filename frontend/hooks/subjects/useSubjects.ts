"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient"
import type { SubjectLite } from "@/hooks/classes/useClassSubjects"

export function useInstitutionSubjects(institutionId: string) {
  return useQuery({
    queryKey: ["institution-subjects", institutionId],
    queryFn: () =>
      apiGet<SubjectLite[]>(`/api/institutions/${institutionId}/subjects`),
    staleTime: 60_000,
  })
}

export function useCreateSubject(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["create-subject", institutionId],
    mutationFn: (payload: {
      name: string
      description?: string
      teacher_id?: string
      profile_picture_id?: string
      banner_id?: string
    }) => apiPost(`/api/institutions/${institutionId}/subjects`, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}

export function useSubject(institutionId: string, subjectId?: string) {
  return useQuery({
    enabled: Boolean(institutionId && subjectId),
    queryKey: ["subject", institutionId, subjectId],
    queryFn: () =>
      apiGet<SubjectLite>(
        `/api/institutions/${institutionId}/subjects/${subjectId}`
      ),
  })
}

export function useUpdateSubject(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["update-subject", institutionId, subjectId],
    mutationFn: (payload: {
      name?: string
      description?: string
      teacher_id?: string
      profile_picture_id?: string
      banner_id?: string
    }) =>
      apiPut(
        `/api/institutions/${institutionId}/subjects/${subjectId}`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subject", institutionId, subjectId] })
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}

export function useDeleteSubject(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["delete-subject", institutionId],
    mutationFn: (subjectId: string) =>
      apiDelete(`/api/institutions/${institutionId}/subjects/${subjectId}`),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}
