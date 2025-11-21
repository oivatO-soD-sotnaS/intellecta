"use client"

import React, { useMemo } from "react"
import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  EndHour,
  StartHour,
  WeekCellsHeight,
} from "@/components/event-calendar/constants"
import { cn } from "@/lib/utils"
import { isMultiDayEvent } from "./utils"
import { useCurrentTimeIndicator } from "./hooks/use-current-time-indicator"
import { EventItem } from "./event-item"
import { DraggableEvent } from "./draggable-event"
import { DroppableCell } from "./droppable-cell"
import { CalendarEvent } from "./types"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventSelect: (event: CalendarEvent) => void
  onEventCreate: (startTime: Date) => void
}

interface PositionedEvent {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
  zIndex: number
}

export function WeekView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: WeekViewProps) {
  const cellHeight = WeekCellsHeight

  const dias = useMemo(() => {
    const inicioSemana = startOfWeek(currentDate, { weekStartsOn: 0 })
    const fimSemana = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: inicioSemana, end: fimSemana })
  }, [currentDate])

  const inicioSemana = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate]
  )

  const horas = useMemo(() => {
    const inicioDia = startOfDay(currentDate)
    return eachHourOfInterval({
      start: addHours(inicioDia, StartHour),
      end: addHours(inicioDia, EndHour - 1),
    })
  }, [currentDate])

  // Obter eventos de dia inteiro e eventos de múltiplos dias para a semana
  const eventosDiaInteiro = useMemo(() => {
    return events
      .filter((event) => {
        return isMultiDayEvent(event)
      })
      .filter((event) => {
        const inicioEvento = new Date(event.event.event_start)
        const fimEvento = new Date(event.event.event_end)
        return dias.some(
          (dia) =>
            isSameDay(dia, inicioEvento) ||
            isSameDay(dia, fimEvento) ||
            (dia > inicioEvento && dia < fimEvento)
        )
      })
  }, [events, dias])

  // Processar eventos para cada dia para calcular posições
  const eventosProcessadosPorDia = useMemo(() => {
    const resultado = dias.map((dia) => {
      // Obter eventos para este dia que não são eventos de dia inteiro ou de múltiplos dias
      const eventosDoDia = events.filter((event) => {
        if (isMultiDayEvent(event)) return false

        const inicioEvento = new Date(event.event.event_start)
        const fimEvento = new Date(event.event.event_end)

        return (
          isSameDay(dia, inicioEvento) ||
          isSameDay(dia, fimEvento) ||
          (inicioEvento < dia && fimEvento > dia)
        )
      })

      // Ordenar eventos por horário de início e duração
      const eventosOrdenados = [...eventosDoDia].sort((a, b) => {
        const inicioA = new Date(a.event.event_start)
        const inicioB = new Date(b.event.event_start)
        const fimA = new Date(a.event.event_end)
        const fimB = new Date(b.event.event_end)

        if (inicioA < inicioB) return -1
        if (inicioA > inicioB) return 1

        const duracaoA = differenceInMinutes(fimA, inicioA)
        const duracaoB = differenceInMinutes(fimB, inicioB)
        return duracaoB - duracaoA
      })

      // Calcular posições para cada evento
      const eventosPosicionados: PositionedEvent[] = []
      const inicioDia = startOfDay(dia)

      // Acompanhar colunas para eventos sobrepostos
      const colunas: { event: CalendarEvent; end: Date }[][] = []

      eventosOrdenados.forEach((event) => {
        const inicioEvento = new Date(event.event.event_start)
        const fimEvento = new Date(event.event.event_end)

        // Ajustar horários de início e fim se estiverem fora deste dia
        const inicioAjustado = isSameDay(dia, inicioEvento) ? inicioEvento : inicioDia
        const fimAjustado = isSameDay(dia, fimEvento)
          ? fimEvento
          : addHours(inicioDia, 24)

        // Calcular posição superior e altura
        const horaInicio =
          getHours(inicioAjustado) + getMinutes(inicioAjustado) / 60
        const horaFim = getHours(fimAjustado) + getMinutes(fimAjustado) / 60

        const topo = (horaInicio - StartHour) * cellHeight
        const altura = (horaFim - horaInicio) * cellHeight

        // Encontrar uma coluna para este evento
        let indiceColuna = 0
        let colocado = false

        while (!colocado) {
          const coluna = colunas[indiceColuna] || []
          if (coluna.length === 0) {
            colunas[indiceColuna] = coluna
            colocado = true
          } else {
            const sobrepoe = coluna.some((c) =>
              areIntervalsOverlapping(
                { start: inicioAjustado, end: fimAjustado },
                {
                  start: new Date(c.event.event.event_start),
                  end: new Date(c.event.event.event_end),
                }
              )
            )
            if (!sobrepoe) {
              colocado = true
            } else {
              indiceColuna++
            }
          }
        }

        const colunaAtual = colunas[indiceColuna] || []
        colunas[indiceColuna] = colunaAtual
        colunaAtual.push({ event, end: fimAjustado })

        const largura = indiceColuna === 0 ? 1 : 0.9
        const esquerda = indiceColuna === 0 ? 0 : indiceColuna * 0.1

        eventosPosicionados.push({
          event,
          top: topo,
          height: altura,
          left: esquerda,
          width: largura,
          zIndex: 10 + indiceColuna,
        })
      })

      return eventosPosicionados
    })

    return resultado
  }, [dias, events, cellHeight])

  const handleCliqueEvento = (evento: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventSelect(evento)
  }

  const mostrarSecaoDiaInteiro = eventosDiaInteiro.length > 0
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week"
  )

  return (
    <div data-slot="week-view" className="flex h-full flex-col">
      <div className="sticky top-0 z-30 grid grid-cols-8 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="py-2 text-center text-sm text-muted-foreground/70">
          <span className="max-[479px]:sr-only">{format(new Date(), "O", { locale: ptBR })}</span>
        </div>
        {dias.map((dia) => (
          <div
            key={dia.toString()}
            className="py-2 text-center text-sm text-muted-foreground/70 data-today:font-medium data-today:text-foreground"
            data-today={isToday(dia) || undefined}
          >
            <span className="sm:hidden" aria-hidden="true">
              {format(dia, "E", { locale: ptBR })[0]} {format(dia, "d", { locale: ptBR })}
            </span>
            <span className="max-sm:hidden">{format(dia, "EEE dd", { locale: ptBR })}</span>
          </div>
        ))}
      </div>

      {mostrarSecaoDiaInteiro && (
        <div className="border-b border-border/70 bg-muted/50">
          <div className="grid grid-cols-8">
            <div className="relative border-r border-border/70">
              <span className="absolute bottom-0 left-0 h-6 w-16 max-w-full pe-2 text-right text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                Dia inteiro
              </span>
            </div>
            {dias.map((dia, indiceDia) => {
              const eventosDiaInteiroDoDia = eventosDiaInteiro.filter((event) => {
                const inicioEvento = new Date(event.event.event_start)
                const fimEvento = new Date(event.event.event_end)
                return (
                  isSameDay(dia, inicioEvento) ||
                  (dia > inicioEvento && dia < fimEvento) ||
                  isSameDay(dia, fimEvento)
                )
              })

              return (
                <div
                  key={dia.toString()}
                  className="relative border-r border-border/70 p-1 last:border-r-0"
                  data-today={isToday(dia) || undefined}
                >
                  {eventosDiaInteiroDoDia.map((evento) => {
                    const inicioEvento = new Date(evento.event.event_start)
                    const fimEvento = new Date(evento.event.event_end)
                    const isPrimeiroDia = isSameDay(dia, inicioEvento)
                    const isUltimoDia = isSameDay(dia, fimEvento)

                    const isPrimeiroDiaVisivel =
                      indiceDia === 0 && isBefore(inicioEvento, inicioSemana)
                    const deveMostrarTitulo = isPrimeiroDia || isPrimeiroDiaVisivel

                    return (
                      <EventItem
                        key={`spanning-${evento.generic_id}`}
                        onClick={(e) => handleCliqueEvento(evento, e)}
                        event={evento}
                        view="month"
                        isFirstDay={isPrimeiroDia}
                        isLastDay={isUltimoDia}
                      >
                        <div
                          className={cn(
                            "truncate",
                            !deveMostrarTitulo && "invisible"
                          )}
                          aria-hidden={!deveMostrarTitulo}
                        >
                          {evento.event.title}
                        </div>
                      </EventItem>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-8 overflow-auto">
        <div className="grid auto-cols-fr border-r border-border/70">
          {horas.map((hora, indice) => (
            <div
              key={hora.toString()}
              style={{ height: cellHeight }}
              className="relative border-b border-border/70 last:border-b-0"
            >
              {indice > 0 && (
                <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                  {format(hora, "HH'h'", { locale: ptBR })}
                </span>
              )}
            </div>
          ))}
        </div>

        {dias.map((dia, indiceDia) => (
          <div
            key={dia.toString()}
            className="relative grid auto-cols-fr border-r border-border/70 last:border-r-0"
            data-today={isToday(dia) || undefined}
          >
            {/* Eventos posicionados */}
            {(eventosProcessadosPorDia[indiceDia] ?? []).map((eventoPosicionado) => (
              <div
                key={eventoPosicionado.event.generic_id}
                className="absolute z-10 px-0.5"
                style={{
                  top: `${eventoPosicionado.top}px`,
                  height: `${eventoPosicionado.height}px`,
                  left: `${eventoPosicionado.left * 100}%`,
                  width: `${eventoPosicionado.width * 100}%`,
                  zIndex: eventoPosicionado.zIndex,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="size-full">
                  <DraggableEvent
                    event={eventoPosicionado.event}
                    view="week"
                    onClick={(e) => handleCliqueEvento(eventoPosicionado.event, e)}
                    showTime
                    height={eventoPosicionado.height}
                  />
                </div>
              </div>
            ))}

            {/* Indicador de hora atual - mostrar apenas para a coluna de hoje */}
            {currentTimeVisible && isToday(dia) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="relative flex items-center">
                  <div className="absolute -left-1 h-2 w-2 rounded-full bg-primary"></div>
                  <div className="h-[2px] w-full bg-primary"></div>
                </div>
              </div>
            )}
            
            {/* Células para cada hora e quarto de hora */}
            {horas.map((hora) => {
              const valorHora = getHours(hora)
              return (
                <div
                  key={hora.toString()}
                  style={{ height: cellHeight }}
                  className="relative border-b border-border/70 last:border-b-0"
                >
                  {/* Intervalos de quarto de hora */}
                  {[0, 1, 2, 3].map((quarto) => {
                    const horaQuarto = valorHora + quarto * 0.25
                    return (
                      <div
                        key={`${hora.toString()}-${quarto}`}
                        style={{
                          height: cellHeight / 4,
                          top: quarto * (cellHeight / 4),
                          position: 'absolute',
                          width: '100%',
                        }}
                      >
                        <DroppableCell
                          id={`week-cell-${dia.toISOString()}-${horaQuarto}`}
                          date={dia}
                          time={horaQuarto}
                          className="w-full h-full"
                          onClick={() => {
                            const horarioInicio = new Date(dia)
                            horarioInicio.setHours(valorHora)
                            horarioInicio.setMinutes(quarto * 15)
                            onEventCreate(horarioInicio)
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}