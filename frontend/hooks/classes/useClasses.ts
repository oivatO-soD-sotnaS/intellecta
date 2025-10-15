// hooks/classes/useClasses.ts
import { useQuery } from "@tanstack/react-query"
import { getClasses, getClass } from "@/services/classes"
import type { ClassDTO } from "@/types/class"

export function useClasses(institutionId: string) {
  return useQuery<ClassDTO[]>({
    queryKey: ["classes", institutionId],
    queryFn: () => getClasses(institutionId),
    staleTime: 30_000,
    retry: false, 
  })
}

export function useClass(institutionId: string, classId: string) {
  return useQuery<ClassDTO>({
    queryKey: ["class", institutionId, classId],
    queryFn: () => getClass(institutionId, classId),
    enabled: Boolean(institutionId && classId),
    staleTime: 30_000,
  })
}
