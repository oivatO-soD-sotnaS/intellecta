export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type InstitutionSummary = {
  institution_id: string
  name: string
  email: string
  profile_picture?: FileRef | null
  banner?: FileRef | null
}

export type InstitutionDetails = InstitutionSummary & {
  user_id?: string
  description?: string
}
