export interface SubjectEvent {
  subject_event_id: string
  subject_id: string
  institution_id?: string

  title?: string
  description?: string
  starts_at?: string
  ends_at?: string
  location?: string
  type?: string

  created_at?: string
  updated_at?: string

}

export type CreateSubjectEventInput = {
  title: string
  description?: string
  starts_at?: string
  ends_at?: string
  location?: string
  type?: string
}

export type UpdateSubjectEventInput = {
  title?: string
  description?: string
  starts_at?: string
  ends_at?: string
  location?: string
  type?: string
}
