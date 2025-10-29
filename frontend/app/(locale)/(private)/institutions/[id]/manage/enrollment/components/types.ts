export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
}

export type UserLite = {
  user_id: string
  full_name: string
  email: string
  profile_picture?: FileRef
}

export type InstitutionUser = {
  institution_user_id: string
  institution_id: string
  user_id: string
  role: "admin" | "professor" | "aluno" | string
  created_at: string
  user: UserLite
}

export type ClassUser = {
  class_users_id: string
  joined_at: string
  class_id: string
  user_id: string
  role: "admin" | "professor" | "aluno" | string
  user: UserLite
}

export type ClassSummary = {
  class_id: string
  name: string
}
