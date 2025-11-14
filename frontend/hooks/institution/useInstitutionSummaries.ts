// hooks/institution/useInstitutionSummaries.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { InstitutionSummaryDTO } from "../institutions/useInstitution";
// ajuste esse import pro tipo que você já tiver
// ou crie esse tipo baseado no contrato da API se ainda não existir

type ApiList =
  | InstitutionSummaryDTO[]
  | { items: InstitutionSummaryDTO[]; total?: number }

const norm = (data: ApiList): InstitutionSummaryDTO[] => {
  const arr = Array.isArray(data) ? data : (data.items ?? [])
  return arr
}

export function useInstitutionSummaries() {
  return useQuery({
    queryKey: ["institution", "summaries"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        // aqui usamos o proxy do Next:
        // app/api/institutions/summaries/route.ts  ->  /api/institutions/summaries
        const data = await apiGet<ApiList>("/api/institutions/summaries")
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
