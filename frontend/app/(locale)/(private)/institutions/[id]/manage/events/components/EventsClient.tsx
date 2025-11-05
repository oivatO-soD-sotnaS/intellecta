"use client"

import * as React from "react"
import { useCallback, useMemo, useState } from "react"

import {
  useInstitutionEvents,
  useCreateInstitutionEvent,
  useUpdateInstitutionEvent,
  useDeleteInstitutionEvent,
  mapInstitutionsToCalendar,
} from "@/hooks/events/useInstitutionEvents"

import {
  mapSubjectsToCalendar,
  useCreateSubjectEvent,
  useDeleteSubjectEvent,
  useSubjectEvents,
  useUpdateSubjectEvent,
} from "@/hooks/events/useSubjectEvents"

import { CalendarEvent, EventColor } from "@/components/event-calendar"

import EventsToolbar from "./EventsToolbar"
import SubjectPicker from "./SubjectPicker"
import CalendarWrapper from "./CalendarWrapper"
import EventFormModal from "./EventFormModal"
import EventDetailsDrawer from "./EventDetailsDrawer"
import DeleteConfirmModal from "./DeleteConfirmModal"
import EmptyState from "./EmptyState"
import { SkeletonToolbar, SkeletonCalendar } from "./Skeletons"

type Props = {
  institutionId: string
}

type Scope = "institution" | "subject"

/**
 * Helper para extrair um possível tipo de evento a partir da cor.
 * (Opcional, apenas para manter simetria; seu backend aceita event_type livre.)
 */
function inferEventTypeFromColor(color?: EventColor): string | undefined {
  switch (color) {
    case "rose":
      return "exam"
    case "amber":
      return "deadline"
    case "sky":
      return "meeting"
    case "orange":
      return "class"
    case "emerald":
      return "holiday"
    case "violet":
      return "other"
    default:
      return undefined
  }
}

export default function EventsClient({ institutionId }: Props) {
  // -----------------------------
  // UI State
  // -----------------------------
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedSubjectId, setSelectedSubjectId] = useState<
    string | undefined
  >(undefined)

  // Form modal (create/edit)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formScope, setFormScope] = useState<Scope>("institution")
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Details drawer
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsEvent, setDetailsEvent] = useState<CalendarEvent | null>(null)

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    scope: Scope
    id: string
  } | null>(null)

  // -----------------------------
  // Queries (institucional + subject)
  // -----------------------------
  const instQuery = useInstitutionEvents(institutionId)
  const subjQuery = useSubjectEvents(institutionId, selectedSubjectId ?? "")

  // -----------------------------
  // Mutations
  // -----------------------------
  const createInstitution = useCreateInstitutionEvent(institutionId)
  const updateInstitution = useUpdateInstitutionEvent(institutionId)
  const deleteInstitution = useDeleteInstitutionEvent(institutionId)

  const createSubject = useCreateSubjectEvent(
    institutionId,
    selectedSubjectId ?? ""
  )
  const updateSubject = useUpdateSubjectEvent(
    institutionId,
    selectedSubjectId ?? ""
  )
  const deleteSubject = useDeleteSubjectEvent(
    institutionId,
    selectedSubjectId ?? ""
  )

  // -----------------------------
  // Data mapping
  // -----------------------------
  const institutionEvents = useMemo<CalendarEvent[]>(() => {
    return mapInstitutionsToCalendar(instQuery.data ?? [])
  }, [instQuery.data])

  const subjectEvents = useMemo<CalendarEvent[]>(() => {
    return mapSubjectsToCalendar(subjQuery.data ?? [])
  }, [subjQuery.data])

  const mergedEvents = useMemo<CalendarEvent[]>(() => {
    // Se há disciplina selecionada, mostra ambos (instituição + disciplina).
    // Caso não haja, mostra apenas institucional (experiência mais limpa).
    return selectedSubjectId
      ? [...institutionEvents, ...subjectEvents]
      : institutionEvents
  }, [institutionEvents, subjectEvents, selectedSubjectId])

  const isLoading =
    instQuery.isLoading || (selectedSubjectId ? subjQuery.isLoading : false)

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleOpenCreate = useCallback(() => {
    // Se há disciplina selecionada, padrão do formulário vira "subject"
    const scope: Scope = selectedSubjectId ? "subject" : "institution"
    setFormScope(scope)
    setEditingEvent(null)
    setIsFormOpen(true)
  }, [selectedSubjectId])

  const handleEventClick = useCallback((evt: CalendarEvent) => {
    setDetailsEvent(evt)
    setDetailsOpen(true)
  }, [])

  const handleEditFromDetails = useCallback(
    (evt: CalendarEvent) => {
      setDetailsOpen(false)
      // Tentativa de inferir escopo: se há subject selecionado e o id está na lista de subjectEvents, trate como "subject"
      const isSubjectEvt = subjectEvents.some((e) => e.id === evt.id)
      setFormScope(isSubjectEvt ? "subject" : "institution")
      setEditingEvent(evt)
      setIsFormOpen(true)
    },
    [subjectEvents]
  )

  const handleDeleteFromDetails = useCallback(
    (evt: CalendarEvent) => {
      setDetailsOpen(false)
      const isSubjectEvt = subjectEvents.some((e) => e.id === evt.id)
      setDeleteTarget({
        scope: isSubjectEvt ? "subject" : "institution",
        id: evt.id,
      })
      setDeleteOpen(true)
    },
    [subjectEvents]
  )

  const handleSubmitForm = useCallback(
    async (payload: {
      // campos mínimos que o EventFormModal deve fornecer
      title: string
      description?: string
      start: Date
      end: Date
      allDay?: boolean
      color?: EventColor
      location?: string
      event_type?: string // opcional se o modal já devolver
    }) => {
      const event_type =
        payload.event_type ?? inferEventTypeFromColor(payload.color)
      const iso = payload.start.toISOString() // seu backend atual usa "event_date"

      if (editingEvent) {
        // EDIT
        if (formScope === "institution") {
          await updateInstitution.mutateAsync({
            eventId: editingEvent.id,
            data: {
              title: payload.title,
              description: payload.description,
              event_date: iso,
              event_type,
            },
          })
        } else {
          if (!selectedSubjectId) return
          await updateSubject.mutateAsync({
            subjectEventId: editingEvent.id,
            data: {
              title: payload.title,
              description: payload.description,
              event_date: iso,
              event_type,
            },
          })
        }
      } else {
        // CREATE
        if (formScope === "institution") {
          await createInstitution.mutateAsync({
            title: payload.title,
            description: payload.description,
            event_date: iso,
            event_type,
          })
        } else {
          if (!selectedSubjectId) return
          await createSubject.mutateAsync({
            title: payload.title,
            description: payload.description,
            event_date: iso,
            event_type,
          })
        }
      }

      setIsFormOpen(false)
      setEditingEvent(null)
    },
    [
      editingEvent,
      formScope,
      selectedSubjectId,
      createInstitution,
      updateInstitution,
      createSubject,
      updateSubject,
    ]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const { scope, id } = deleteTarget

    if (scope === "institution") {
      await deleteInstitution.mutateAsync(id)
    } else {
      if (!selectedSubjectId) return
      await deleteSubject.mutateAsync(id)
    }

    setDeleteOpen(false)
    setDeleteTarget(null)
  }, [deleteTarget, deleteInstitution, deleteSubject, selectedSubjectId])

  // -----------------------------
  // Render
  // -----------------------------
  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonToolbar />
        <SkeletonCalendar />
      </div>
    )
  }

  if (!mergedEvents.length && !selectedSubjectId && !instQuery.isFetching) {
    return (
      <div className="space-y-6">
        <EventsToolbar
          date={currentDate}
          onDateChange={setCurrentDate}
          view={view}
          onViewChange={setView}
          onAdd={handleOpenCreate}
          isLoading={false}
          rightSlot={
            <SubjectPicker
              institutionId={institutionId}
              value={selectedSubjectId}
              onValueChange={setSelectedSubjectId}
            />
          }
        />
        <EmptyState
          title="Sem eventos por aqui"
          description="Crie o primeiro evento institucional ou selecione uma disciplina para ver os eventos."
          ctaLabel="Novo evento"
          onCta={handleOpenCreate}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EventsToolbar
        date={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
        onAdd={handleOpenCreate}
        isLoading={instQuery.isFetching || subjQuery.isFetching}
        rightSlot={
          <SubjectPicker
            institutionId={institutionId}
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
          />
        }
      />

      <CalendarWrapper
        events={mergedEvents}
        onEventAdd={
          handleOpenCreate /* botão do toolbar já supre; aqui mantemos sem side effects */
        }
        onEventClick={handleEventClick}
      />

      {/* Modal de criação/edição */}
      <EventFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingEvent(null)
        }}
        // Escopo atual (define em qual rota salvar)
        scope={formScope}
        // Se tiver disciplina selecionada, passamos para o modal (caso ele precise)
        subjectId={selectedSubjectId}
        // Quando for edição, passa o evento
        initialEvent={editingEvent ?? undefined}
        onSubmit={handleSubmitForm}
      />

      {/* Drawer de detalhes */}
      <EventDetailsDrawer
        open={detailsOpen}
        event={detailsEvent ?? undefined}
        onClose={() => setDetailsOpen(false)}
        onEdit={() => {
          if (!detailsEvent) return
          handleEditFromDetails(detailsEvent)
        }}
        onDelete={() => {
          if (!detailsEvent) return
          handleDeleteFromDetails(detailsEvent)
        }}
      />

      {/* Confirmação de exclusão */}
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir evento?"
        description="Esta ação é irreversível."
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
