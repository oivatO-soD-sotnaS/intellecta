// hooks/invitations/useInvitations.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { InvitationDTO } from "@/types/invitation"

type ApiList = InvitationDTO[] | { items: InvitationDTO[]; total?: number }

const norm = (data: ApiList): InvitationDTO[] => {
  const arr = Array.isArray(data) ? data : (data.items ?? [])
  return arr
}

export function useInvitations() {
  return useQuery({
    queryKey: ["invitations"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const data = await apiGet<ApiList>("/api/invitations")
        return norm(data)
      } catch (err: any) {
        const status =
          err?.status ?? err?.response?.status ?? err?.cause?.status

        if (status === 404) {
          return []
        }

        throw err
      }
    },
  })
}
