"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/apiClient";

export type Subject = { id: string; name: string };

type Resp = { items: Subject[] } | Subject[];

function normalize(data: Resp): Subject[] {
  return Array.isArray(data) ? data : data.items ?? [];
}

export function useInstitutionSubjects(institutionId?: string) {
  return useQuery({
    enabled: !!institutionId,
    queryKey: ["institution", institutionId, "subjects"],
    queryFn: async () => normalize(await apiGet<Resp>(`/api/institutions/${institutionId}/subjects`)),
    staleTime: 30_000,
  });
}
