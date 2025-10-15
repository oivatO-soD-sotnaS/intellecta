"use client"

import * as React from "react"
import { addDays, setHours, setMinutes, subDays } from "date-fns"
import { CalendarEvent, EventCalendar } from "@/components/event-calendar"

// Import do componente gerado pelo shadcn/origin


/**
 * Widget de calendário para o dashboard da instituição.
 * - Usa estado local (mock) para validação de UI.
 * - Já expõe handlers de add/update/delete para você acoplar na API depois.
 * - Mantém interface compatível com o EventCalendar do Origin UI.
 */

type Props = {
  institutionId?: string // reservado p/ futura integração da API
}

export default function CalendarWidget({ institutionId }: Props) {
  // Eventos de exemplo (mesma ideia do snippet do Origin UI)
  const [events, setEvents] = React.useState<CalendarEvent[]>(() =>
    sampleEvents()
  )

  const handleEventAdd = (event: CalendarEvent) => {
    const withId = { ...event, id: event.id ?? genId() }
    setEvents((prev) => [...prev, withId])
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    )
  }

  const handleEventDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <EventCalendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  )
}

/* ---------- helpers & mock ---------- */

function genId() {
  // ID estável o suficiente para mock (substitua por ID da API futuramente)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return crypto.randomUUID()
  return `evt_${Math.random().toString(36).slice(2, 10)}`
}

function sampleEvents(): CalendarEvent[] {
  return [
    {
      id: "1",
      title: "Planejamento Anual",
      description: "Encontro geral de planejamento",
      start: subDays(new Date(), 24),
      end: subDays(new Date(), 23),
      allDay: true,
      color: "sky",
      location: "Auditório Principal",
    },
    {
      id: "2",
      title: "Prazo do Projeto",
      description: "Entrega final",
      start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
      end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
      color: "amber",
      location: "Escritório",
    },
    {
      id: "3",
      title: "Revisão Orçamentária",
      description: "Análise trimestral",
      start: subDays(new Date(), 13),
      end: subDays(new Date(), 13),
      allDay: true,
      color: "orange",
      location: "Sala 2",
    },
    {
      id: "4",
      title: "Reunião de Equipe",
      description: "Weekly team sync",
      start: setMinutes(setHours(new Date(), 10), 0),
      end: setMinutes(setHours(new Date(), 11), 0),
      color: "sky",
      location: "Sala A",
    },
    {
      id: "5",
      title: "Almoço com Parceiro",
      description: "Alinhamento comercial",
      start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
      end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
      color: "emerald",
      location: "Café Centro",
    },
    {
      id: "6",
      title: "Lançamento do Produto",
      description: "Apresentação oficial",
      start: addDays(new Date(), 3),
      end: addDays(new Date(), 6),
      allDay: true,
      color: "violet",
    },
    {
      id: "7",
      title: "Conferência de Vendas",
      description: "Novos clientes",
      start: setMinutes(setHours(addDays(new Date(), 4), 14), 30),
      end: setMinutes(setHours(addDays(new Date(), 5), 14), 45),
      color: "rose",
      location: "Centro de Eventos",
    },
    {
      id: "8",
      title: "Aula: Eletromagnetismo",
      description: "Turma Física III",
      start: setMinutes(setHours(addDays(new Date(), 5), 9), 0),
      end: setMinutes(setHours(addDays(new Date(), 5), 10), 30),
      color: "orange",
      location: "Bloco C - 301",
    },
    {
      id: "9",
      title: "Correção de Contratos",
      description: "Análise jurídica",
      start: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
      end: setMinutes(setHours(addDays(new Date(), 5), 15), 30),
      color: "sky",
      location: "Sala Jurídica",
    },
    {
      id: "10",
      title: "Aula: Programação Web",
      description: "Turma 2025/2",
      start: setMinutes(setHours(addDays(new Date(), 5), 9), 45),
      end: setMinutes(setHours(addDays(new Date(), 5), 11), 0),
      color: "amber",
      location: "Lab 2",
    },
    {
      id: "11",
      title: "Marketing Strategy",
      description: "Planejamento trimestral",
      start: setMinutes(setHours(addDays(new Date(), 9), 10), 0),
      end: setMinutes(setHours(addDays(new Date(), 9), 15), 30),
      color: "emerald",
      location: "Depto Marketing",
    },
    {
      id: "12",
      title: "Assembleia Anual",
      description: "Resultados do ano",
      start: addDays(new Date(), 17),
      end: addDays(new Date(), 17),
      allDay: true,
      color: "sky",
      location: "Centro de Convenções",
    },
    {
      id: "13",
      title: "Workshop de Produto",
      description: "Ideação de features",
      start: setMinutes(setHours(addDays(new Date(), 26), 9), 0),
      end: setMinutes(setHours(addDays(new Date(), 27), 17), 0),
      color: "rose",
      location: "Innovation Lab",
    },
  ]
}
