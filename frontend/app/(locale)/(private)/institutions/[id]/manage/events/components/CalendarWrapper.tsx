"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { EventCalendar, type CalendarEvent } from "@/components/event-calendar" // <- componente + tipos unificados

type Props = {
  events: CalendarEvent[]
  onEventAdd?: (event: CalendarEvent) => void
  onEventClick?: (event: CalendarEvent) => void
}

export default function CalendarWrapper({
  events,
  onEventAdd,
  onEventClick,
}: Props) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const handleAdd = useCallback(
    (evt: CalendarEvent) => {
      onEventAdd?.(evt)
    },
    [onEventAdd]
  )

  const handleClick = useCallback(
    (evt: CalendarEvent) => {
      onEventClick?.(evt)
    },
    [onEventClick]
  )

  return (
    <EventCalendar
      currentDate={currentDate}
      onCurrentDateChange={setCurrentDate}
      view={view}
      onViewChange={setView}
      events={events}
      onEventAdd={handleAdd}
      onEventClick={handleClick}
    />
  )
}
