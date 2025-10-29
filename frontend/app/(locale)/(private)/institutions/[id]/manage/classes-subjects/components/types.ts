export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type Teacher = {
  user_id: string
  full_name: string
  email: string
  profile_picture?: FileRef
}

export type Subject = {
  subject_id: string
  name: string
  description?: string
  institution_id: string
  teacher_id: string
  profile_picture_id?: string
  banner_id?: string
  teacher: Teacher
  profile_picture?: string
  banner?: string
}

export type ClassSummary = {
  class_id: string
  name: string
}

export type ClassSubject = {
  class_subjects_id: string
  class_id: string
  subject: Subject
}

export type Assignment = {
  assignment_id: string
  title: string
  description?: string
  deadline: string
  subject_id: string
  attachment_id?: string
  attachment?: FileRef
}

export type Material = {
  material_id: string
  title: string
  created_at: string
  changed_at?: string
  subject_id: string
  file_id: string
  file: FileRef
}
