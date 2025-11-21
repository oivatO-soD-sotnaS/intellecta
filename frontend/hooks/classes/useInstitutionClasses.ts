"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import { Class } from "@/app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/types"

export function useInstitutionClasses(institutionId: string) {
  return useQuery({
    queryKey: ["institution-classes", institutionId],
    queryFn: () =>
      apiGet<Class[]>(`/api/institutions/${institutionId}/classes`),
    staleTime: 60_000,
  })
}
