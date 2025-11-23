// src/hooks/subjects/useSubjectEvents.ts
"use client"

import { SubjectEvent } from "@/hooks/events/useSubjectEvents"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateSubjectEventInput, UpdateSubjectEventInput } from "./types"

export function useSubjectEvent(institutionId: string, subjectId?: string) {
  return useQuery<SubjectEvent[], Error>({
    enabled: Boolean(institutionId && subjectId),
    queryKey: ["subject-events", institutionId, subjectId],
    retry: false,
    queryFn: async () => {
      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/events`

      const res = await fetch(url, {
        method: "GET",
      })

      if (res.status === 404) {
        return []
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao carregar eventos da disciplina (status ${res.status})`
        )
      }

      const data = (await res.json()) as SubjectEvent[]
      return data
    },
  })
}

export function useCreateSubjectEvent(
  institutionId: string,
  subjectId?: string
) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["create-subject-event", institutionId, subjectId],
    mutationFn: async (input: CreateSubjectEventInput) => {
      if (!institutionId || !subjectId) {
        throw new Error("Instituição e disciplina são obrigatórias")
      }

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/events`

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao criar evento da disciplina (status ${res.status})`
        )
      }

      const data = (await res.json()) as SubjectEvent
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-events", institutionId, subjectId],
      })
    },
  })
}

export function useUpdateSubjectEvent(
  institutionId: string,
  subjectId?: string
) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["update-subject-event", institutionId, subjectId],
    mutationFn: async (params: {
      eventId: string
      data: UpdateSubjectEventInput
    }) => {
      const { eventId, data } = params

      if (!institutionId || !subjectId) {
        throw new Error("Instituição e disciplina são obrigatórias")
      }

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/events/${eventId}`

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao atualizar evento da disciplina (status ${res.status})`
        )
      }

      const updated = (await res.json()) as SubjectEvent
      return updated
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-events", institutionId, subjectId],
      })
    },
  })
}

export function useDeleteSubjectEvent(
  institutionId: string,
  subjectId?: string
) {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ["delete-subject-event", institutionId, subjectId],
    mutationFn: async (eventId: string) => {
      if (!institutionId || !subjectId) {
        throw new Error("Instituição e disciplina são obrigatórias")
      }

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/events/${eventId}`

      const res = await fetch(url, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao excluir evento da disciplina (status ${res.status})`
        )
      }

      return true
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["subject-events", institutionId, subjectId],
      })
    },
  })
}
