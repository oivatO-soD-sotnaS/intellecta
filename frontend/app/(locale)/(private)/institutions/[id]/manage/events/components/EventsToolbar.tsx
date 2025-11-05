// app/(locale)/(private)/institutions/[id]/manage/events/_components/EventsToolbar.tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Props = {
  view: "month" | "week" | "day" | "agenda"
  onViewChange: (v: Props["view"]) => void
  date: Date
  onDateChange: (d: Date) => void
  search: string
  onSearchChange: (v: string) => void
  eventType?: string
  onEventTypeChange: (v?: string) => void
  onNewEvent: () => void
}

export default function EventsToolbar({
  view,
  onViewChange,
  date,
  onDateChange,
  search,
  onSearchChange,
  eventType,
  onEventTypeChange,
  onNewEvent,
}: Props) {
  const goPrev = () =>
    onDateChange(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  const goNext = () =>
    onDateChange(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  const goToday = () => onDateChange(new Date())

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={goNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="gap-2" onClick={goToday}>
          <CalendarDays className="h-4 w-4" /> Hoje
        </Button>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título ou descrição..."
          className="w-full md:max-w-md"
        />

        <Select
          value={eventType ?? ""}
          onValueChange={(v) => onEventTypeChange(v || undefined)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo (cor)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="emerald">Feriados</SelectItem>
            <SelectItem value="rose">Provas</SelectItem>
            <SelectItem value="sky">Reuniões</SelectItem>
            <SelectItem value="amber">Prazos</SelectItem>
            <SelectItem value="violet">Outros</SelectItem>
          </SelectContent>
        </Select>

        <Select value={view} onValueChange={(v) => onViewChange(v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mês</SelectItem>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="day">Dia</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onNewEvent} className="ml-auto md:hidden">
          Novo
        </Button>
      </div>
    </div>
  )
}
