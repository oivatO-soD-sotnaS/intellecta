import { FileMetadata } from "@/hooks/use-file-upload"

export type AttachmentLite = {
  file_id: string
  url: string
  filename: string
  mime_type: string
  size: number
  uploaded_at?: string
}

export type Assignment = {
  assignment_id: string
  title: string
  description?: string
  deadline?: string
  subject_id: string
  attachment_id?: string
  attachment?: AttachmentLite | null
}

export type CreateAssignmentInput = {
  title: string
  description: string
  deadline: string | null
  attachment?: File | null | FileMetadata
}

export type UpdateAssignmentInput = {
  title: string
  description: string
  deadline: string | null
  attachment?: File | null | FileMetadata
}