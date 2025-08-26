// hooks/institution/useInstitutionsOwned.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import type { ApiInstitution, Institution } from "@/types/institution";
import { mapApiInstitution, normalizeList } from "@/types/institution.mappers";

export function useInstitutionsOwned() {
  return useQuery({
    queryKey: ["institutions", "owned"],
    queryFn: async () => {
      const data = await apiGet<ApiInstitution[] | { items: ApiInstitution[] }>("/api/institutions/owned");
      return normalizeList(data).map(mapApiInstitution);
    },
    staleTime: 60_000,
  });
}
