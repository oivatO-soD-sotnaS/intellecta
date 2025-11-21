"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/apiClient"
import { Assignment, CreateAssignmentInput, UpdateAssignmentInput } from "./types"


export function useSubjectAssignment(
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
      retry: 2
  })
}

export function useCreateAssignment(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["create-assignment", institutionId, subjectId],
    mutationFn: async (input: CreateAssignmentInput) => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments`

      const hasAttachment = input.attachment instanceof File
      let response: Response

      if (hasAttachment) {
        const formData = new FormData()
        formData.append("title", input.title)
        formData.append("description", input.description)
        if (input.deadline) {
          formData.append("deadline", input.deadline)
        }
        formData.append("attachment", input.attachment as File)

        response = await fetch(url, {
          method: "POST",
          body: formData, 
        })
      } else {
        const { attachment, ...jsonBody } = input

        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
        })
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao criar atividade (status ${response.status})`
        )
      }

      return response.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-assignments", institutionId, subjectId],
      })
    },
  })
}

export function useAssignmentById(
  institutionId: string,
  subjectId: string,
  assignmentId?: string
) {
  return useQuery<Assignment>({
    queryKey: ["assignment-detail", institutionId, subjectId, assignmentId],
    queryFn: () =>
      apiGet(
        `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}`
      ),
    enabled: !!institutionId && !!subjectId && !!assignmentId,
  })
}

export function useUpdateAssignment(institutionId: string, subjectId?: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["update-assignment", institutionId, subjectId],
    mutationFn: async (
      input: UpdateAssignmentInput & { assignmentId: string }
    ) => {
      const { assignmentId, ...rest } = input
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/assignments/${assignmentId}`

      const hasAttachment = rest.attachment instanceof File
      let response: Response

      if (hasAttachment) {
        const formData = new FormData()
        formData.append("title", rest.title)
        formData.append("description", rest.description)
        if (rest.deadline) {
          formData.append("deadline", rest.deadline)
        }
        formData.append("attachment", rest.attachment as File)

        response = await fetch(url, {
          method: "PATCH",
          body: formData,
        })
      } else {
        const { attachment, ...jsonBody } = rest

        response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
        })
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        throw new Error(
          errorText || `Erro ao atualizar atividade (status ${response.status})`
        )
      }

      return response.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-assignments", institutionId, subjectId],
      })
      qc.invalidateQueries({
        queryKey: ["assignment-detail", institutionId, subjectId],
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
