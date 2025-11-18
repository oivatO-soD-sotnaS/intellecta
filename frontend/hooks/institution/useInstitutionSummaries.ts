// hooks/institution/useInstitutionsSummaries.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import type { ApiInstitutionSummary } from "@/types/institution";
import { mapApiInstitutionSummary, normalizeList } from "@/types/institution.mappers";

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
