// type/subject.tsx
// Tipos alinhados ao contrato de "Classes" do seu backend (Swagger).

export type FileDTO = {
  file_id: string
  url?: string | null
  filename?: string | null
  mime_type?: string | null
  size?: number | null
  uploaded_at?: string | null
  file_type?: string | null // ex: "image"
  title?: string | null
}

export type ClassDTO = {
  class_id: string
  institution_id: string
  name: string
  description?: string | null
  profile_picture?: FileDTO | null // avatar/ícone da turma
  banner?: FileDTO | null // capa da turma
}

export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type TeacherLite = {
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
  teacher_id?: string
  teacher?: TeacherLite
  profile_picture?: string | FileRef
  banner?: string | FileRef
}

export type ClassSubject = {
  class_subjects_id: string
  class_id: string
  subject: Subject
}


export type InstitutionClassesResponse = ClassDTO[]
