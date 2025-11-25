// src/hooks/classes/useClassUsers.ts
"use client"

import { useQuery } from "@tanstack/react-query"

export interface ClassUser {
  class_users_id: string
  joined_at: string
  class_id: string
  user_id: string
  user: {
    user_id: string
    full_name: string
    email: string
    profile_picture?: {
      file_id: string
      url: string
      filename: string
      mime_type: string
      size: number
    } | null
  }
}

export function useClassUsers(institutionId: string, classId?: string) {
  return useQuery<ClassUser[], Error>({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-users", institutionId, classId],
    retry: false,
    queryFn: async () => {
      const url = `/api/institutions/${institutionId}/classes/${classId}/users`

      const res = await fetch(url, {
        method: "GET",
      })

      if (res.status === 404) {
        return []
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao carregar usuários da turma (status ${res.status})`
        )
      }

      const data = (await res.json()) as ClassUser[]
      return data
    },
  })
}
