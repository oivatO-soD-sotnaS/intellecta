// hooks/events/useInstitutionEvents.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient"
import type { CalendarEvent, EventColor } from "@/components/event-calendar" // <- tipos unificados do calendário

export type InstitutionalEvent = {
  institutional_event_id: string
  institution_id: string
  event_id: string
  title: string
  description?: string
  event_date: string // ISO
  event_type?: string
}

export type CreateInstitutionEventPayload = {
  title: string
  description?: string
  event_date: string // ISO
  event_type?: string
}

export type UpdateInstitutionEventPayload =
  Partial<CreateInstitutionEventPayload>

const colorMap: Record<string, EventColor> = {
  holiday: "emerald",
  exam: "rose",
  meeting: "sky",
  deadline: "amber",
}

export function mapInstitutionToCalendar(e: InstitutionalEvent): CalendarEvent {
  const d = new Date(e.event_date)
  const colorKey = (e.event_type ?? "").toLowerCase()
  return {
    id: e.event_id,
    title: e.title,
    description: e.description,
    start: d,
    end: d, // ou: new Date(d.getTime() + 60 * 60 * 1000)
    allDay: true,
    color: colorMap[colorKey] ?? "violet",
  }
}

export function mapInstitutionsToCalendar(
  arr: InstitutionalEvent[]
): CalendarEvent[] {
  return arr.map(mapInstitutionToCalendar)
}

const qk = (institutionId: string) => ["institution-events", institutionId]

export function useInstitutionEvents(institutionId: string) {
  return useQuery({
    queryKey: qk(institutionId),
    queryFn: async () => {
      const res = await apiGet<InstitutionalEvent[]>(
        `/api/institutions/${institutionId}/events`
      )
      return res
    },
    staleTime: 30_000,
  })
}

export function useCreateInstitutionEvent(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInstitutionEventPayload) =>
      apiPost(`/api/institutions/${institutionId}/events`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId) })
    },
  })
}

export function useUpdateInstitutionEvent(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: {
      eventId: string
      data: UpdateInstitutionEventPayload
    }) =>
      apiPut(
        `/api/institutions/${institutionId}/events/${params.eventId}`,
        params.data
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId) })
    },
  })
}

export function useDeleteInstitutionEvent(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) =>
      apiDelete(`/api/institutions/${institutionId}/events/${eventId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk(institutionId) })
    },
  })
}
