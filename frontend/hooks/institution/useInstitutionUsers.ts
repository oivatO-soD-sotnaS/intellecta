"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type InstitutionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Resp = { items: InstitutionUser[] } | InstitutionUser[];

function normalize(data: Resp): InstitutionUser[] {
  return Array.isArray(data) ? data : data.items ?? [];
}

export function useInstitutionUsers(institutionId?: string) {
  return useQuery({
    enabled: !!institutionId,
    queryKey: ["institution", institutionId, "users"],
    queryFn: async () => normalize(await apiGet<Resp>(`/api/institutions/${institutionId}/users`)),
    staleTime: 30_000,
  });
}
