// hooks/subjects/useSubjects.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiDelete, apiFetch } from "@/lib/apiClient"
import type { SubjectLite } from "@/hooks/classes/useClassSubjects"
import type { CreateSubjectResponse } from "@/types/subjects"

/**
 * Lista TODAS as disciplinas da instituição.
 * OBS: você comentou que NÃO vai usar isso no design da página da classe
 * agora, mas esse hook já é usado em outras telas e continua válido.
 */
export function useInstitutionSubjects(institutionId: string) {
  return useQuery({
    queryKey: ["institution-subjects", institutionId],
    queryFn: () =>
      apiGet<SubjectLite[]>(`/api/institutions/${institutionId}/subjects`),
    staleTime: 60_000,
    enabled: Boolean(institutionId),
  })
}

/* --------------------------- useCreateSubject --------------------------- */

export type CreateSubjectInput = {
  name: string
  description: string
  teacher_id?: string

  // novos campos, opcionais, para upload de imagens
  profilePictureFile?: File | null
  bannerFile?: File | null
}

/**
 * Criação de disciplina
 * POST /api/institutions/{institution_id}/subjects
 *
 * - Usa FormData para permitir envio de arquivos (profile-picture, banner)
 * - Se nenhum arquivo for enviado, ainda funciona (form-data só com texto)
 */
export function useCreateSubject(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["create-subject", institutionId],
    mutationFn: async (payload: CreateSubjectInput) => {
      if (!institutionId) {
        throw new Error("institutionId é obrigatório em useCreateSubject")
      }

      const formData = new FormData()
      formData.append("name", payload.name)
      formData.append("description", payload.description)

      if (payload.teacher_id) {
        formData.append("teacher_id", payload.teacher_id)
      }

      if (payload.profilePictureFile) {
        // nome do campo conforme a documentação do backend
        formData.append("profile-picture", payload.profilePictureFile)
      }

      if (payload.bannerFile) {
        formData.append("banner", payload.bannerFile)
      }

      const data = await apiFetch<CreateSubjectResponse>(
        `/api/institutions/${institutionId}/subjects`,
        {
          method: "POST",
          body: formData,
        }
      )      

      return data
    },
    onSuccess: () => {
      // Atualiza a lista de disciplinas da instituição
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}

/* --------------------------- useDeleteSubject --------------------------- */

export function useDeleteSubject(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["delete-subject", institutionId],
    mutationFn: (subjectId: string) =>
      apiDelete<{ message: string }>(
        `/api/institutions/${institutionId}/subjects/${subjectId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["institution-subjects", institutionId],
      })
    },
  })
}
