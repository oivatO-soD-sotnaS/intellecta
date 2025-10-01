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

export type InstitutionClassesResponse = ClassDTO[]
