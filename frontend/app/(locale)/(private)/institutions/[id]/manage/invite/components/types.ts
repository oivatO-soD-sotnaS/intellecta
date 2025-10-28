// app/(locale)/(private)/institutions/[id]/manage/people/components/types.ts
export type FileRef = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at: string
  file_type: "image" | string
}

export type UserLite = {
  user_id: string
  full_name: string
  email: string
  created_at: string
  changed_at: string
  profile_picture?: FileRef
}

export type InstitutionLite = {
  institution_id: string
  name: string
  email: string
  description: string
  profilePicture?: FileRef
  banner?: FileRef
}

export type Invitation = {
  invitation_id: string
  email: string
  role: "admin" | "professor" | "aluno" | string
  expires_at: string
  accepted_at?: string | null
  created_at: string
  institution_id: string
  invited_by: string
  institution?: InstitutionLite
  invited_by_user?: UserLite
}
