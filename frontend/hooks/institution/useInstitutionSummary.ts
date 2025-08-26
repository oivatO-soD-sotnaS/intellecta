// hooks/institution/useInstitutionSummary.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import type { ApiInstitutionSummary, InstitutionSummary } from "@/types/institution";
import { mapApiInstitutionSummary } from "@/types/institution.mappers";

export function useInstitutionSummary(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["institution", id, "summary"],
    queryFn: async () =>
      mapApiInstitutionSummary(
        await apiGet<ApiInstitutionSummary>(`/api/institutions/summaries/${id}`)
      ),
    staleTime: 60_000,
  });
}
