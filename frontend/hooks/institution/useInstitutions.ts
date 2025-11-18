// hooks/institution/useInstitutions.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import { ApiInstitution, Institution } from "@/types/institution";
import { mapApiInstitution } from "@/types/institution.mappers";

type ApiList = ApiInstitution[] | { items: ApiInstitution[]; total?: number };

const norm = (data: ApiList): Institution[] => {
  const arr = Array.isArray(data) ? data : data.items ?? [];
  return arr.map(mapApiInstitution);
}

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: async () => norm(await apiGet<ApiList>("/api/institutions")),
    staleTime: 60_000,
  });
}
