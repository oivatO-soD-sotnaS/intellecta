// hooks/institutions/useInstitutionUsers.ts
"use client"

import { useQuery } from "@tanstack/react-query"

export type FileRef = {
  file_id: string
  url?: string | null
  filename?: string | null
  mime_type?: string | null
  size?: number | null
  uploaded_at?: string | null
  file_type?: string | null
}

export type InstitutionUser = {
  institution_user_id: string
  institution_id: string
  role: "admin" | "teacher" | "student"
  joined_at: string
  user: {
    user_id: string
    full_name: string
    email: string
    created_at: string
    changed_at: string
    profile_picture?: FileRef
  }
}

async function fetchInstitutionUsers(
  institutionId: string
): Promise<InstitutionUser[]> {
  const res = await fetch(`/api/institutions/${institutionId}/users`, {
    credentials: "include",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao obter usuários: ${res.status} ${text}`)
  }
  return res.json()
}

export function useInstitutionUsers(institutionId: string) {
  return useQuery({
    queryKey: ["institution-users", institutionId],
    queryFn: () => fetchInstitutionUsers(institutionId),
    enabled: !!institutionId,
    staleTime: 30_000,
  })
}
