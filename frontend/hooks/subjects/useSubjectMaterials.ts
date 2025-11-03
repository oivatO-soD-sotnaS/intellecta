"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient"

export type FileLite = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type Material = {
  material_id: string
  title: string
  created_at?: string
  changed_at?: string
  subject_id: string
  file_id?: string
  file?: FileLite | null
}

export function useSubjectMaterials(institutionId: string, subjectId?: string) {
  return useQuery({
    enabled: Boolean(institutionId && subjectId),
    queryKey: ["subject-materials", institutionId, subjectId],
    queryFn: () =>
      apiGet<Material[]>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/materials`
      ),
  })
}

export function useCreateMaterial(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["create-material", institutionId, subjectId],
    // Espera FormData (title, file)
    mutationFn: (form: FormData) =>
      apiPost(
        `/api/institutions/${institutionId}/subjects/${subjectId}/materials`,
        form
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-materials", institutionId, subjectId],
      })
    },
  })
}

export function useUpdateMaterial(
  institutionId: string,
  subjectId?: string,
  materialId?: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["update-material", institutionId, subjectId, materialId],
    // Pode ser FormData (troca de arquivo) ou JSON (apenas título)
    mutationFn: (payload: FormData | { title?: string }) =>
      payload instanceof FormData
        ? apiPut(
            `/api/institutions/${institutionId}/subjects/${subjectId}/materials/${materialId}`,
            payload
          )
        : apiPut(
            `/api/institutions/${institutionId}/subjects/${subjectId}/materials/${materialId}`,
            payload
          ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-materials", institutionId, subjectId],
      })
    },
  })
}

export function useDeleteMaterial(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ["delete-material", institutionId, subjectId],
    mutationFn: (materialId: string) =>
      apiDelete(
        `/api/institutions/${institutionId}/subjects/${subjectId}/materials/${materialId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-materials", institutionId, subjectId],
      })
    },
  })
}
