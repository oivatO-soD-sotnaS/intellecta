"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiDelete } from "@/lib/apiClient"

export type SubjectLite = {
  subject_id: string
  name: string
  description?: string
  teacher_id?: string
  profile_picture?: string | { url?: string } | null
  banner?: string | { url?: string } | null
  teacher?: {
    user_id: string
    full_name?: string
    email?: string
    profile_picture?: { url?: string } | null
  }
}

export type ClassSubject = {
  class_subjects_id: string
  class_id: string
  subject: SubjectLite
}

export function useClassSubjects(institutionId: string, classId?: string) {
  return useQuery({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-subjects", institutionId, classId],
    queryFn: () =>
      apiGet<ClassSubject[]>(
        `/api/institutions/${institutionId}/classes/${classId}/subjects`
      ),
  })
}

export function useAddSubjectToClass(institutionId: string, classId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["add-class-subject", institutionId, classId],
    mutationFn: (payload: { subject_id: string }) =>
      apiPost(
        `/api/institutions/${institutionId}/classes/${classId}/subjects`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", institutionId, classId],
      })
    },
  })
}

export function useClassSubject(
  institutionId: string,
  classId: string | undefined,
  classSubjectId: string | undefined
) {
  return useQuery({
    enabled: Boolean(institutionId && classId && classSubjectId),
    queryKey: ["class-subject", institutionId, classId, classSubjectId],
    queryFn: () =>
      apiGet<ClassSubject>(
        `/api/institutions/${institutionId}/classes/${classId}/subjects/${classSubjectId}`
      ),
  })
}

export function useRemoveClassSubject(institutionId: string, classId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["remove-class-subject", institutionId, classId],
    mutationFn: (classSubjectId: string) =>
      apiDelete(
        `/api/institutions/${institutionId}/classes/${classId}/subjects/${classSubjectId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["class-subjects", institutionId, classId],
      })
    },
  })
}
