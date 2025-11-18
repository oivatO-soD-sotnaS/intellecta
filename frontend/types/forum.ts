export type ForumMessageUserDTO = {
  user_id: string
  full_name: string
  email: string
  created_at: string
  changed_at: string
  profile_picture?: {
    file_id: string
    url: string
    filename: string
    mime_type: string
    size: number
    uploaded_at: string
    file_type: string
  } | null
} | null

export type ForumMessageDTO = {
  forum_messages_id: string
  content: string
  created_at: string
  changed_at: string
  sent_by: ForumMessageUserDTO
  subject_id: string
}

export type ForumMessagesPagingDTO = {
  page: number
  total_pages: number
  total_records: number
}

export type ForumMessagesPageDTO = {
  paging: ForumMessagesPagingDTO
  records: ForumMessageDTO[]
}

export type ForumMessagesFilters = {
  content?: string
  created_at_from?: string
  created_at_to?: string
}

export type ForumMessagesQueryParams = ForumMessagesFilters & {
  page?: number
  limit?: number
}
