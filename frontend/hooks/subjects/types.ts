// hooks/subjects/types.ts

export interface SubmissionFileDTO {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export interface SubmissionUserDTO {
  user_id: string
  full_name: string
  email: string
  profile_picture?: SubmissionFileDTO | null
}

export interface SubmissionDTO {
  submission_id: string
  submitted_at: string
  concept: string | null
  feedback: string | null
  assignment_id: string
  user_id: string
  attachment_id: string | null
  user: SubmissionUserDTO
  attachment?: SubmissionFileDTO | null
}
