// hooks/classes/useClasses.ts
import { useQuery } from "@tanstack/react-query"
import type { ClassDTO } from "@/types/class"
import { getClass, getClasses } from "@/services/classes"

export function useClasses(institutionId: string) {
  return useQuery<ClassDTO[]>({
    queryKey: ["classes", institutionId],
    queryFn: () => getClasses(institutionId),
    staleTime: 30_000, 
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
