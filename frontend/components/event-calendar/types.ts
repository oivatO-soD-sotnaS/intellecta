export type CalendarView = "mês" | "semana" | "dia" | "agenda"

type ApiEvent = {
  event_id: string
  title: string
  description: string
  type: string
  event_start: string // "YYYY-MM-DD HH:mm:ss"
  event_end: string
  created_at: string
  changed_at: string
}

export type CalendarEvent = {
  generic_event_id: string // user|subject|institutional_event_id
  generic_id: string // User|Subject|Institution ID
  event: ApiEvent
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"
