"use client"

import { useMemo } from "react"
import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { differenceInMinutes, format, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { getBorderRadiusClasses } from "./utils"
import { CalendarEvent } from "./types"

// Usando formatação personalizada com date-fns:
// 'H' - horas (0-23)
// 'mm' - minutos com zero à esquerda
const formatTimeWithOptionalMinutes = (date: Date | string | null | undefined): string => {
  // Validar se o parâmetro é null ou undefined
  if (date === null || date === undefined) {
    console.warn('formatTimeWithOptionalMinutes: Parâmetro date é null ou undefined')
    return "Horário inválido"
  }

  let dataFormatada: Date

  try {
    // Se for string, tentar converter para Date
    if (typeof date === 'string') {
      dataFormatada = new Date(date)
      
      // Verificar se a conversão foi bem-sucedida
      if (isNaN(dataFormatada.getTime())) {
        console.warn('formatTimeWithOptionalMinutes: String de data inválida:', date)
        return "Horário inválido"
      }
    } else {
      dataFormatada = date
    }

    // Verificar se a data é válida
    if (isNaN(dataFormatada.getTime())) {
      console.warn('formatTimeWithOptionalMinutes: Data inválida:', dataFormatada)
      return "Horário inválido"
    }

    // Verificar se os minutos estão disponíveis antes de usar getMinutes()
    const minutos = dataFormatada.getMinutes()
    
    // Usar formatação condicional baseada nos minutos
    if (minutos === 0) {
      return format(dataFormatada, "H'h'", { locale: ptBR })
    } else {
      return format(dataFormatada, "H'h'mm", { locale: ptBR })
    }

  } catch (error) {
    console.error('formatTimeWithOptionalMinutes: Erro ao formatar data:', error)
    return "Erro de formatação"
  }
}

// Mapeamento de cores para tipos de evento
const getEventTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    exam: "bg-red-100 text-red-900 border-red-200 hover:bg-red-200",
    quiz: "bg-orange-100 text-orange-900 border-orange-200 hover:bg-orange-200",
    assignment: "bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200",
    lecture: "bg-green-100 text-green-900 border-green-200 hover:bg-green-200",
    workshop: "bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200",
    seminar: "bg-indigo-100 text-indigo-900 border-indigo-200 hover:bg-indigo-200",
    presentation: "bg-pink-100 text-pink-900 border-pink-200 hover:bg-pink-200",
    deadline: "bg-yellow-100 text-yellow-900 border-yellow-200 hover:bg-yellow-200",
    holiday: "bg-emerald-100 text-emerald-900 border-emerald-200 hover:bg-emerald-200",
    announcement: "bg-cyan-100 text-cyan-900 border-cyan-200 hover:bg-cyan-200",
    cultural: "bg-violet-100 text-violet-900 border-violet-200 hover:bg-violet-200",
    sports: "bg-lime-100 text-lime-900 border-lime-200 hover:bg-lime-200",
    other: "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200",
  }
  
  return colorMap[type] || colorMap.other
}

interface EventWrapperProps {
  event: CalendarEvent
  isFirstDay?: boolean
  isLastDay?: boolean
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  children: React.ReactNode
  currentTime?: Date
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

// Componente wrapper compartilhado para estilização de eventos
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  // Sempre usa o currentTime (se fornecido) para determinar se o evento está no passado
  const displayEnd = currentTime
    ? new Date(
        new Date(currentTime).getTime() +
          (new Date(event.event.event_end).getTime() - new Date(event.event.event_start).getTime())
      )
    : new Date(event.event.event_end)

  const isEventInPast = isPast(displayEnd)

  return (
    <button
      className={cn(
        "flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-dragging:shadow-lg data-past-event:line-through sm:px-2 border",
        getBorderRadiusClasses(isFirstDay, isLastDay),
        getEventTypeColor(event.event.type),
        className
      )}
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  )
}

interface EventItemProps {
  event: CalendarEvent
  view: "month" | "week" | "day" | "agenda"
  isDragging?: boolean
  onClick?: (e: React.MouseEvent) => void
  showTime?: boolean
  currentTime?: Date // Para atualizar o tempo durante o arrasto
  isFirstDay?: boolean
  isLastDay?: boolean
  children?: React.ReactNode
  className?: string
  dndListeners?: SyntheticListenerMap
  dndAttributes?: DraggableAttributes
  onMouseDown?: (e: React.MouseEvent) => void
  onTouchStart?: (e: React.TouchEvent) => void
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  // Usa o currentTime fornecido (para arrasto) ou o tempo real do evento
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.event.event_start)
  }, [currentTime, event.event.event_start])

  const displayEnd = useMemo(() => {
    return currentTime
      ? new Date(
          new Date(currentTime).getTime() +
            (new Date(event.event.event_end).getTime() - new Date(event.event.event_start).getTime())
        )
      : new Date(event.event.event_end)
  }, [currentTime, event.event.event_start, event.event.event_end])

  // Calcula a duração do evento em minutos
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart)
  }, [displayStart, displayEnd])

  const getEventTime = () => {
    // Para eventos curtos (menos de 45 minutos), mostra apenas o horário de início
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart)
    }

    // Para eventos mais longos, mostra horário de início e fim
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`
  }

  if (view === "month") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs",
          className
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <span className="truncate">
            <span className="truncate font-normal opacity-70 sm:text-[11px]">
              {formatTimeWithOptionalMinutes(displayStart)}{" "}
            </span>
            {event.event.title}
          </span>
        )}
      </EventWrapper>
    )
  }

  if (view === "week" || view === "day") {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn(
          "py-1",
          durationMinutes < 45 ? "items-center" : "flex-col",
          view === "week" ? "text-[10px] sm:text-xs" : "text-xs",
          className
        )}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.event.title}{" "}
            {showTime && (
              <span className="opacity-70">
                {formatTimeWithOptionalMinutes(displayStart)}
              </span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.event.title}</div>
            {showTime && (
              <div className="truncate font-normal opacity-70 sm:text-[11px]">
                {getEventTime()}
              </div>
            )}
          </>
        )}
      </EventWrapper>
    )
  }

  // Vista agenda - mantida separada pois é significativamente diferente
  return (
    <button
      className={cn(
        "flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90",
        getEventTypeColor(event.event.type),
        className
      )}
      data-past-event={isPast(new Date(event.event.event_end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <div className="text-sm font-medium">{event.event.title}</div>
      <div className="text-xs opacity-70">
        <span>
          {formatTimeWithOptionalMinutes(displayStart)} -{" "}
          {formatTimeWithOptionalMinutes(displayEnd)}
        </span>
      </div>
      {event.event.description && (
        <div className="my-1 text-xs opacity-90">{event.event.description}</div>
      )}
    </button>
  )
}