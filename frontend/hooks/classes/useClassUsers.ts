"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"

export type ClassUserRow = {
  class_users_id: string
  joined_at: string
  class_id: string
  user_id: string
  user: {
    user_id: string
    full_name: string
    email: string
    profile_picture?: { url?: string } | null
  }
}

export function useClassUsers(institutionId: string, classId?: string) {
  return useQuery({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-users", institutionId, classId],
    queryFn: () =>
      apiGet<ClassUserRow[]>(
        `/api/institutions/${institutionId}/classes/${classId}/users`
      ),
    refetchOnWindowFocus: false,
  })
}
