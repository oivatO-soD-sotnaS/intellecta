"use client"

import { useEffect, useMemo, useState } from "react"
import { RiCalendarCheckLine } from "@remixicon/react"
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarEvent, CalendarView } from "./types"
import { addHoursToDate } from "./utils"
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from "./constants"
import { CalendarDndProvider } from "./calendar-dnd-context"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { DayView } from "./day-view"
import { AgendaView } from "./agenda-view"
import { EventDialog } from "./event-dialog"

export interface EventCalendarProps {
  events: CalendarEvent[]
  onEventAdd: (event: CalendarEvent) => void
  onEventUpdate: (event: CalendarEvent) => void
  onEventDelete: (eventId: string) => void
  className?: string
  initialView?: CalendarView
  canMutate: boolean
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "mês",
  canMutate = false
}: EventCalendarProps) {
  const [dataAtual, setDataAtual] = useState(new Date())
  const [visualizacao, setVisualizacao] = useState<CalendarView>(initialView)
  const [dialogEventoAberto, setDialogEventoAberto] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState<CalendarEvent | null>(null)

  // Adicionar atalhos de teclado para trocar visualização
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pular se o usuário estiver digitando em um input, textarea ou elemento contentEditable
      // ou se o dialog de evento estiver aberto
      if (
        dialogEventoAberto ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setVisualizacao("mês")
          break
        case "s":
          setVisualizacao("semana")
          break
        case "d":
          setVisualizacao("dia")
          break
        case "a":
          setVisualizacao("agenda")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [dialogEventoAberto])

  const handleAnterior = () => {
    if (visualizacao === "mês") {
      setDataAtual(subMonths(dataAtual, 1))
    } else if (visualizacao === "semana") {
      setDataAtual(subWeeks(dataAtual, 1))
    } else if (visualizacao === "dia") {
      setDataAtual(addDays(dataAtual, -1))
    } else if (visualizacao === "agenda") {
      // Para visualização agenda, voltar 30 dias (um mês completo)
      setDataAtual(addDays(dataAtual, -AgendaDaysToShow))
    }
  }

  const handleProximo = () => {
    if (visualizacao === "mês") {
      setDataAtual(addMonths(dataAtual, 1))
    } else if (visualizacao === "semana") {
      setDataAtual(addWeeks(dataAtual, 1))
    } else if (visualizacao === "dia") {
      setDataAtual(addDays(dataAtual, 1))
    } else if (visualizacao === "agenda") {
      // Para visualização agenda, avançar 30 dias (um mês completo)
      setDataAtual(addDays(dataAtual, AgendaDaysToShow))
    }
  }

  const handleHoje = () => {
    setDataAtual(new Date())
  }

  const handleSelecionarEvento = (evento: CalendarEvent) => {
    setEventoSelecionado(evento)
    setDialogEventoAberto(true)
  }

  const handleCriarEvento = (horaInicio: Date) => {
    const novoEvento: CalendarEvent = {
      generic_id: `evento-${Date.now()}`,
      generic_event_id: `evento-${Date.now()}`,
      event: {
        event_id: `evento-${Date.now()}`,
        title: "Novo Evento",
        description: "",
        event_start: horaInicio.toISOString(),
        event_end: addHoursToDate(horaInicio, 1).toISOString(),
        type: "other",
        created_at: new Date().toISOString(),
        changed_at: new Date().toISOString(),
      },
    }
    onEventAdd(novoEvento)
  }

  const tituloVisualizacao = useMemo(() => {
    if (visualizacao === "mês") {
      return format(dataAtual, "MMMM yyyy", { locale: ptBR })
    } else if (visualizacao === "semana") {
      const inicio = startOfWeek(dataAtual, { weekStartsOn: 0 })
      const fim = endOfWeek(dataAtual, { weekStartsOn: 0 })
      if (isSameMonth(inicio, fim)) {
        return format(inicio, "MMMM yyyy", { locale: ptBR })
      } else {
        return `${format(inicio, "MMM", { locale: ptBR })} - ${format(fim, "MMM yyyy", { locale: ptBR })}`
      }
    } else if (visualizacao === "dia") {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(dataAtual, "d 'de' MMM, yyyy", { locale: ptBR })}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(dataAtual, "d 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
          <span className="max-md:hidden">
            {format(dataAtual, "EEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </>
      )
    } else if (visualizacao === "agenda") {
      // Mostrar o intervalo do mês para visualização agenda
      const inicio = dataAtual
      const fim = addDays(dataAtual, AgendaDaysToShow - 1)

      if (isSameMonth(inicio, fim)) {
        return format(inicio, "MMMM yyyy", { locale: ptBR })
      } else {
        return `${format(inicio, "MMM", { locale: ptBR })} - ${format(fim, "MMM yyyy", { locale: ptBR })}`
      }
    } else {
      return format(dataAtual, "MMMM yyyy", { locale: ptBR })
    }
  }, [dataAtual, visualizacao])

  return (
    <div
      className="flex flex-col rounded-lg border has-data-[slot=mês-view]:flex-1"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--semana-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={onEventUpdate}>
        <div
          className={cn(
            "flex items-center justify-between p-2 sm:p-4",
            className
          )}
        >
          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              variant="outline"
              className="max-[479px]:aspect-square max-[479px]:p-0!"
              onClick={handleHoje}
            >
              <RiCalendarCheckLine
                className="min-[480px]:hidden"
                size={16}
                aria-hidden="true"
              />
              <span className="max-[479px]:sr-only">Hoje</span>
            </Button>
            <div className="flex items-center sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAnterior}
                aria-label="Anterior"
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProximo}
                aria-label="Próximo"
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </div>
            <h2 className="text-sm font-semibold capitalize sm:text-lg md:text-xl">
              {tituloVisualizacao}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                  <span>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                      {visualizacao.charAt(0).toUpperCase()}
                    </span>
                    <span className="max-[479px]:sr-only capitalize">
                      {visualizacao}
                    </span>
                  </span>
                  <ChevronDownIcon
                    className="-me-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setVisualizacao("mês")}>
                  Mês <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisualizacao("semana")}>
                  Semana <DropdownMenuShortcut>S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisualizacao("dia")}>
                  Dia <DropdownMenuShortcut>D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisualizacao("agenda")}>
                  Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {canMutate && (
              <Button
                className="max-[479px]:aspect-square max-[479px]:p-0!"
                size="sm"
                onClick={() => {
                  setEventoSelecionado(null) // Garantir que estamos criando um novo evento
                  setDialogEventoAberto(true)
                }}
              >
                <PlusIcon
                  className="opacity-60 sm:-ms-1"
                  size={16}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Novo evento</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {visualizacao === "mês" && (
            <MonthView
              currentDate={dataAtual}
              events={events}
              onEventSelect={handleSelecionarEvento}
              onEventCreate={handleCriarEvento}
            />
          )}
          {visualizacao === "semana" && (
            <WeekView
              currentDate={dataAtual}
              events={events}
              onEventSelect={handleSelecionarEvento}
              onEventCreate={handleCriarEvento}
            />
          )}
          {visualizacao === "dia" && (
            <DayView
              currentDate={dataAtual}
              events={events}
              onEventSelect={handleSelecionarEvento}
              onEventCreate={handleCriarEvento}
            />
          )}
          {visualizacao === "agenda" && (
            <AgendaView
              currentDate={dataAtual}
              events={events}
              onEventSelect={handleSelecionarEvento}
            />
          )}
        </div>

        <EventDialog
          event={eventoSelecionado}
          isOpen={dialogEventoAberto}
          canMutate={canMutate}
          onClose={() => {
            setDialogEventoAberto(false)
            setEventoSelecionado(null)
          }}
          onSave={(evento) => {
            if (eventoSelecionado) {
              onEventUpdate(evento)
            } else {
              onEventAdd(evento)
            }
          }}
          onDelete={onEventDelete}
        />
      </CalendarDndProvider>
    </div>
  )
}