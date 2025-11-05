// hooks/events/useSubjectEvents.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient"
import type { CalendarEvent, EventColor } from "@/components/event-calendar" // <- tipos unificados do calendário

export type SubjectEvent = {
  subject_event_id: string
  institution_id: string
  subject_id: string
  title: string
  description?: string
  event_date: string // ISO (seguindo o contrato que você colou)
  event_type?: string
}

export type CreateSubjectEventPayload = {
  title: string
  description?: string
  event_date: string // ISO
  event_type?: string
}

export type UpdateSubjectEventPayload = Partial<CreateSubjectEventPayload>

const colorMap: Record<string, EventColor> = {
  holiday: "emerald",
  exam: "rose",
  meeting: "sky",
  deadline: "amber",
}

export function mapSubjectToCalendar(e: SubjectEvent): CalendarEvent {
  const d = new Date(e.event_date)
  const colorKey = (e.event_type ?? "").toLowerCase()
  return {
    id: e.subject_event_id,
    title: e.title,
    description: e.description,
    start: d,
    end: d, // ou: new Date(d.getTime() + 60 * 60 * 1000)
    allDay: true,
    color: colorMap[colorKey] ?? "violet",
  }
}

export function mapSubjectsToCalendar(arr: SubjectEvent[]): CalendarEvent[] {
  return arr.map(mapSubjectToCalendar)
}

const qk = (institutionId: string, subjectId?: string) =>
  ["subject-events", institutionId, subjectId] as const

export function useSubjectEvents(institutionId: string, subjectId?: string) {
  return useQuery({
    queryKey: qk(institutionId, subjectId),
    queryFn: async () => {
      if (!subjectId) return [] as SubjectEvent[]
      const res = await apiGet<SubjectEvent[]>(
        `/api/institutions/${institutionId}/subjects/${subjectId}/events`
      )
      return res
    },
    enabled: Boolean(subjectId),
    staleTime: 30_000,
  })
}

export function useCreateSubjectEvent(
  institutionId: string,
  subjectId: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSubjectEventPayload) =>
      apiPost(
        `/api/institutions/${institutionId}/subjects/${subjectId}/events`,
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId, subjectId) })
    },
  })
}

export function useUpdateSubjectEvent(
  institutionId: string,
  subjectId: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      subjectEventId: string
      data: UpdateSubjectEventPayload
    }) =>
      apiPut(
        `/api/institutions/${institutionId}/subjects/${subjectId}/events/${params.subjectEventId}`,
        params.data
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId, subjectId) })
    },
  })
}

export function useDeleteSubjectEvent(
  institutionId: string,
  subjectId: string
) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (subjectEventId: string) =>
      apiDelete(
        `/api/institutions/${institutionId}/subjects/${subjectId}/events/${subjectEventId}`
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId, subjectId) })
    },
  })
}
