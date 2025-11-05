// hooks/institutions/useInstitution.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPut, apiDelete } from "@/lib/apiClient"

export type FileDTO = {
  file_id: string
  url?: string | null
  filename?: string | null
  mime_type?: string | null
  size?: number | null
  uploaded_at?: string | null
}

export type InstitutionSummaryDTO = {
  institution_id: string
  name: string
  email: string
  profile_picture?: FileDTO | null
  banner?: FileDTO | null
}

export type InstitutionDetailsDTO = {
  institution_id: string
  user_id?: string
  name: string
  email: string
  description?: string | null
  profile_picture?: FileDTO | null
  banner?: FileDTO | null
}

type UpdateInstitutionText = {
  type: "text"
  data: Partial<Pick<InstitutionDetailsDTO, "name" | "email" | "description">>
}

type UpdateInstitutionMedia = {
  type: "media"
  data: {
    profilePicture?: File | null
    banner?: File | null
  }
}

export type UpdateInstitutionInput =
  | UpdateInstitutionText
  | UpdateInstitutionMedia

const qkSummary = (institutionId: string) =>
  ["institution", "summary", institutionId] as const

const qkDetails = (institutionId: string) =>
  ["institution", "details", institutionId] as const

export function useInstitutionSummary(institutionId: string) {
  return useQuery({
    queryKey: qkSummary(institutionId),
    queryFn: async () => {
      return apiGet<InstitutionSummaryDTO>(
        `/api/institutions/summaries/${institutionId}`
      )
    },
    staleTime: 60_000,
  })
}

export function useInstitutionDetails(institutionId: string) {
  return useQuery({
    queryKey: qkDetails(institutionId),
    queryFn: async () => {
      return apiGet<InstitutionDetailsDTO>(`/api/institutions/${institutionId}`)
    },
    staleTime: 60_000,
  })
}

export function useUpdateInstitution(institutionId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateInstitutionInput) => {
      if (input.type === "text") {
        // JSON simples
        return apiPut(`/api/institutions/${institutionId}`, input.data)
      }

      // Upload (FormData) — NÂO defina manualmente o Content-Type (o browser cuida do boundary)
      const fd = new FormData()
      if (input.data.profilePicture) {
        fd.append("profile-picture", input.data.profilePicture)
      }
      if (input.data.banner) {
        fd.append("banner", input.data.banner)
      }

      const res = await fetch(`/api/institutions/${institutionId}`, {
        method: "PUT",
        body: fd,
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || `Falha ao atualizar imagens (${res.status})`)
      }
      return res.json().catch(() => ({}))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qkSummary(institutionId) })
      qc.invalidateQueries({ queryKey: qkDetails(institutionId) })
    },
  })
}

export function useDeleteInstitution(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      return apiDelete(`/api/institutions/${institutionId}`)
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: qkSummary(institutionId) })
      qc.removeQueries({ queryKey: qkDetails(institutionId) })
    },
  })
}
