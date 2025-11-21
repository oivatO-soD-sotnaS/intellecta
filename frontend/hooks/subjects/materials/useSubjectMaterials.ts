"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPut, apiDelete } from "@/lib/apiClient"
import { CreateMaterialInput, Material, UpdateMaterialInput } from "./types"


export function useSubjectMaterials(institutionId: string, subjectId?: string) {
  return useQuery<Material[]>({
    enabled: !!institutionId && !!subjectId,
    queryKey: ["subject-materials", institutionId, subjectId],
    retry: 1,
    queryFn: async () => {
      const res = await fetch(
        `/api/institutions/${institutionId}/subjects/${subjectId}/materials`
      )

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao carregar materiais (status ${res.status})`
        )
      }

      return res.json()
    },
  })
}


export function useCreateMaterial(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["create-material", institutionId, subjectId],
    mutationFn: async (input: CreateMaterialInput) => {
      if (!institutionId || !subjectId) {
        throw new Error("institutionId e subjectId são obrigatórios")
      }

      if (!input.file) {
        throw new Error("Arquivo do material é obrigatório")
      }

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/materials`

      const formData = new FormData()
      formData.append("title", input.title)


      formData.append("material_file", input.file)

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao criar material (status ${res.status})`
        )
      }

      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-materials", institutionId, subjectId],
      })
    },
  })
}

export function useMaterialById(
  institutionId: string,
  subjectId?: string,
  materialId?: string
) {
  return useQuery<Material>({
    enabled: !!institutionId && !!subjectId && !!materialId,
    queryKey: ["material-detail", institutionId, subjectId, materialId],
    queryFn: async () => {
      const res = await fetch(
        `/api/institutions/${institutionId}/subjects/${subjectId}/materials/${materialId}`
      )

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao carregar material (status ${res.status})`
        )
      }

      return res.json()
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
    mutationFn: async (payload: UpdateMaterialInput) => {
      if (!institutionId || !subjectId || !materialId) {
        throw new Error(
          "institutionId, subjectId e materialId são obrigatórios para atualizar o material"
        )
      }

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/materials/${materialId}`

      const hasFile = payload.file instanceof File

      let res: Response

      if (hasFile) {
        const formData = new FormData()

        if (payload.title && payload.title.trim()) {
          formData.append("title", payload.title.trim())
        }

        formData.append("material_file", payload.file as File)

        res = await fetch(url, {
          method: "PUT",
          body: formData,
        })
      } else {
        const body: Record<string, unknown> = {}

        if (payload.title && payload.title.trim()) {
          body.title = payload.title.trim()
        }

        res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao atualizar material (status ${res.status})`
        )
      }

      return res.json()
    },
    onSuccess: (_data, _vars, _ctx) => {
      // Atualiza lista de materiais
      qc.invalidateQueries({
        queryKey: ["subject-materials", institutionId, subjectId],
      })
      // e o detalhe, se estiver em cache
      qc.invalidateQueries({
        queryKey: ["material-detail", institutionId, subjectId, materialId],
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
