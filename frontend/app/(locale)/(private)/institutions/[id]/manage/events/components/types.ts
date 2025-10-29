export type InstitutionalEvent = {
  institutional_event_id: string
  institution_id: string
  event_id: string
  title: string
  description?: string
  event_date: string // ISO no backend
  event_type: string // livre: "feriado" | "reuniao" | "prova" | ...
}

/** Cores aceitas pelo EventCalendar (Origin UI) */
export type CalendarColor =
  | "sky"
  | "amber"
  | "orange"
  | "emerald"
  | "violet"
  | "rose"
