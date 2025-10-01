// hooks/classes/mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateClassInput, UpdateClassInput } from "@/types/class"
import { createClass, deleteClass, updateClass } from "@/services/classes"

export function useCreateClass(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateClassInput) =>
      createClass(institutionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
    },
  })
}

export function useUpdateClass(institutionId: string, classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateClassInput) =>
      updateClass(institutionId, classId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
      qc.invalidateQueries({ queryKey: ["class", institutionId, classId] })
    },
  })
}

export function useDeleteClass(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (classId: string) => deleteClass(institutionId, classId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classes", institutionId] })
    },
  })
}
