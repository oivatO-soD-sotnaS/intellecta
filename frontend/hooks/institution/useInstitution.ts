// hooks/institution/useInstitution.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";
import { ApiInstitution, Institution } from "@/types/institution";
import { mapApiInstitution } from "@/types/institution.mappers";

export function useInstitution(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: ["institution", id],
    queryFn: async () => mapApiInstitution(await apiGet<ApiInstitution>(`/api/institutions/${id}`)),
    staleTime: 60_000,
  });
}
