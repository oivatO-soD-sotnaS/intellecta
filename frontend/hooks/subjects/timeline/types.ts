import { ClassUserRow } from "@/hooks/classes/useClassUsers"
import { SubjectEvent } from "@/hooks/events/useSubjectEvents"

export type ClassTimelineItemType =
  | "class_created"
  | "user_joined"
  | "subject_created"
  | "subject_event"

export interface ClassTimelineItem {
  id: string
  type: ClassTimelineItemType
  date: string // ISO
  title: string
  description?: string
  meta?: {
    user?: ClassUserRow["user"]
    subject?: ClassSubject
    event?: SubjectEvent
  }
}

// Tipos mínimos que a gente precisa (ajusta se já tiver tipado em outro lugar)
export interface ClassDetails {
  class_id: string
  name: string
  description?: string
  created_at?: string
}

export interface ClassSubject {
  subject_id: string
  name: string
  description?: string
  created_at?: string
}
