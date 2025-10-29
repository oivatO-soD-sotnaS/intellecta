import { CalendarEvent } from "@/components/event-calendar"
import type { InstitutionalEvent, CalendarColor } from "./types"

export function colorByType(event_type: string): CalendarColor {
  const t = (event_type || "").toLowerCase()
  if (t.includes("feriad")) return "violet"
  if (t.includes("reuni")) return "sky"
  if (t.includes("prov") || t.includes("avali")) return "rose"
  if (t.includes("aviso")) return "amber"
  return "emerald"
}

/**
 * Seu backend só envia `event_date`. Regra mock:
 * - feriado => allDay = true (start=end=event_date)
 * - demais  => allDay = false (end = start + 1h)
 */
export function institutionalToCalendar(e: InstitutionalEvent): CalendarEvent {
  const start = new Date(e.event_date)
  const isAllDay = e.event_type?.toLowerCase().includes("feriad")

  const end = isAllDay
    ? new Date(e.event_date)
    : new Date(start.getTime() + 60 * 60 * 1000)

  return {
    id: e.event_id,
    title: e.title,
    description: e.description,
    start,
    end,
    allDay: isAllDay,
    color: colorByType(e.event_type),
    // location opcional (não há na API)
  }
}
