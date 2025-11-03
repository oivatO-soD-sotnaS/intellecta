"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"

export type InstitutionUserRow = {
  institution_user_id: string
  user_id: string
  role: "admin" | "teacher" | "student"
  user: {
    user_id: string
    full_name: string
    email: string
    profile_picture?: { url?: string } | null
  }
}

export function useInstitutionUsers(institutionId: string) {
  return useQuery({
    queryKey: ["institution-users", institutionId],
    queryFn: () =>
      apiGet<InstitutionUserRow[]>(`/api/institutions/${institutionId}/users`),
    staleTime: 60_000,
  })
}
