// types/class.ts

export type FileDTO = {
  file_id: string
  url?: string | null
  filename?: string | null
  mime_type?: string | null
  size?: number | null
  uploaded_at?: string | null
  file_type?: string | null
  title?: string | null
}

export type ClassDTO = {
  class_id: string
  institution_id: string
  name: string
  description?: string | null
  profile_picture?: FileDTO | null
  banner?: FileDTO | null
}

// payloads para POST/PUT (ajuste campos obrigatórios conforme seu backend)
export type CreateClassInput = {
  name: string
  description?: string | null
  profile_picture_id?: string | null
  banner_id?: string | null
}

export type UpdateClassInput = Partial<CreateClassInput>
