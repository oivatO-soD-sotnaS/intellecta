// hooks/classes/useClasses.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/apiClient"
import type { ClassDTO } from "@/types/class"

type ApiList = ClassDTO[] | { items: ClassDTO[]; total?: number }

const norm = (data: ApiList): ClassDTO[] => {
  const arr = Array.isArray(data) ? data : (data.items ?? [])
  return arr
}

export function useClasses(institutionId: string) {
  return useQuery({
    queryKey: ["classes", institutionId],
    enabled: Boolean(institutionId),
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const data = await apiGet<ApiList>(
          `/api/institutions/${institutionId}/classes`
        )
        return norm(data)
      } catch (e: any) {
        // compatível com seu comportamento anterior
        if (e?.status === 404) return [] as ClassDTO[]
        throw e
      }
    },
  })
}

export function useClass(institutionId: string, classId: string) {
  return useQuery({
    queryKey: ["class", institutionId, classId],
    enabled: Boolean(institutionId && classId),
    staleTime: 60_000,
    queryFn: async () =>
      apiGet<ClassDTO>(
        `/api/institutions/${institutionId}/classes/${classId}`
      ),
  })
}
