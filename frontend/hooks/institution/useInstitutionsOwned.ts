// hooks/institution/useInstitutionsOwned.ts
"use client"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { ApiInstitutionSummary } from "@/types/institution"
import {
  mapApiInstitution,
  mapApiInstitutionSummary,
  normalizeList,
} from "@/types/institution.mappers"

export function useInstitutionsOwned() {
  return useQuery({
    queryKey: ["institutions", "owned"],
    queryFn: async () => {
      const data = await apiGet<
        ApiInstitutionSummary[] | { items: ApiInstitutionSummary[] }
      >("/api/institutions/owned")
      return normalizeList(data).map(mapApiInstitutionSummary)
    },
    staleTime: 60_000,
  })
}
