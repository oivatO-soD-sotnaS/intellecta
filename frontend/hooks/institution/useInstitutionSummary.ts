// hooks/institution/useInstitutionSummary.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { InstitutionSummaryDTO } from "../institutions/useInstitution"

export function useInstitutionSummary(institutionId?: string) {
  return useQuery({
    queryKey: ["institution", "summary", institutionId],
    enabled: !!institutionId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!institutionId) {
        throw new Error("institutionId is required")
      }

      try {
        // proxy: /api/institutions/[institution_id]/summary
        const data = await apiGet<InstitutionSummaryDTO>(
          `/api/institutions/${institutionId}/summary`
        )
        return data
      } catch (err: any) {
        const status =
          err?.status ?? err?.response?.status ?? err?.cause?.status

        if (status === 404) {
          // se quiser, você pode retornar null e tratar no componente
          return null
        }

        throw err
      }
    },
  })
}
