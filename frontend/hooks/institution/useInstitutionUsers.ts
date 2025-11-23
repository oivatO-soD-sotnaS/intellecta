"use client"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { InstitutionUser } from "../institutions/useInstitutionUsers"

type Resp = { items: InstitutionUser[] } | InstitutionUser[]

function normalize(data: Resp): InstitutionUser[] {
  return Array.isArray(data) ? data : (data.items ?? [])
}

export function useInstitutionUsers(institutionId?: string) {
  return useQuery({
    enabled: !!institutionId,
    queryKey: ["institution", institutionId, "users"],
    queryFn: async () =>
      normalize(await apiGet<Resp>(`/api/institutions/${institutionId}/users`)),
    staleTime: 30_000,
  })
}
