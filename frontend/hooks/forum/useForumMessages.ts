"use client"

import { apiGet } from "@/lib/apiClient"
import { useQuery } from "@tanstack/react-query"

export type ForumMessage = {
  forum_messages_id: string
  content: string
  created_at: string
  changed_at: string | null
  subject_id: string
  sent_by: {
    user_id: string
    full_name: string
    email: string
    profile_picture?: {
      file_id: string
      url: string
      filename: string
      mime_type: string
      size: number
      uploaded_at: string
      file_type: string
    } | null
  }
}

export type ForumMessagesResponse = {
  paging: {
    page: number
    total_pages: number
    total_records: number
  }
  records: ForumMessage[]
}

interface UseForumMessagesOptions {
  page?: number 
  limit?: number
  offset?: number
  created_at_from?: string
  created_at_to?: string
  content?: string
}
export function useForumMessages(
  institutionId: string,
  subjectId: string | undefined,
  {
    page,
    limit = 20,
    offset,
    created_at_from,
    created_at_to,
    content,
  }: UseForumMessagesOptions = {}
) {
  const effectiveOffset =
    typeof offset === "number"
      ? offset
      : page && page > 0
        ? (page - 1) * limit
        : 0

  return useQuery({
    enabled: Boolean(institutionId && subjectId),
    queryKey: [
      "forum-messages",
      institutionId,
      subjectId,
      {
        page,
        limit,
        offset: effectiveOffset,
        created_at_from,
        created_at_to,
        content,
      },
    ],
    queryFn: async () => {
      if (!subjectId) {
        throw new Error("Subject ID is required")
      }

      const params = new URLSearchParams()

      params.set("limit", String(limit))
      params.set("offset", String(effectiveOffset))
      // if (created_at_from) params.set("created_at_from", created_at_from)
      // if (created_at_to) params.set("created_at_to", created_at_to)
      if (content) params.set("content", content)

      const url = `/api/institutions/${institutionId}/subjects/${subjectId}/forum/messages?${params.toString()}`

      try {
        const data = await apiGet<ForumMessagesResponse>(url)
        return data
      } catch (err: any) {
        // tenta descobrir o status HTTP do erro
        const status =
          err?.status ?? err?.response?.status ?? err?.cause?.status

        // 👇 se o backend respondeu 404, tratamos como "nenhuma mensagem"
        if (status === 404) {
          return {
            paging: {
              page: page ?? 1,
              total_pages: 0,
              total_records: 0,
            },
            records: [],
          } satisfies ForumMessagesResponse
        }

        // outros erros (500, 401, etc) sobem normalmente
        throw err
      }
    },
  })
}
