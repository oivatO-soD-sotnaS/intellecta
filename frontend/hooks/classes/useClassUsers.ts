"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { User } from "@/app/(locale)/(private)/institutions/[id]/manage/people/components/types"

export type ClassUserRow = {
  class_users_id: string
  joined_at: string
  class_id: string
  user: User
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
