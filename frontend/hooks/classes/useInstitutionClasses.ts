"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"

export type ClassSummary = {
  class_id: string
  name: string
  description?: string
}

export function useInstitutionClasses(institutionId: string) {
  return useQuery({
    queryKey: ["institution-classes", institutionId],
    queryFn: () =>
      apiGet<ClassSummary[]>(`/api/institutions/${institutionId}/classes`),
    staleTime: 60_000,
  })
}
