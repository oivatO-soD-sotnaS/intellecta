// hooks/institution/useInstitutionsSummaries.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import type { ApiInstitutionSummary, InstitutionSummary } from "@/types/institution";
import { mapApiInstitutionSummary, normalizeList } from "@/types/institution.mappers";

export function useInstitutionsSummaries() {
  return useQuery({
    queryKey: ["institutions", "summaries"],
    queryFn: async () => {
      const data = await apiGet<ApiInstitutionSummary[] | { items: ApiInstitutionSummary[] }>("/api/institutions/summaries");
      return normalizeList(data).map(mapApiInstitutionSummary);
    },
    staleTime: 60_000,
  });
}
