export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
  file_type?: string
}

export type User = {
  user_id: string
  full_name: string
  email: string
  created_at: string
  changed_at: string
  profile_picture?: FileRef
}

export type InstitutionUserRole = "admin" | "teacher" | "student"

export type InstitutionUser = {
  institution_user_id: string
  institution_id: string
  user_id: string
  role: InstitutionUserRole
  created_at: string
  user: User
}
