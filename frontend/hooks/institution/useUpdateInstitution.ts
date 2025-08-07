import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateInstitution } from "../../app/(locale)/(private)/institutions/[id]/services/institutionService"
import type { InstitutionDto } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionSchema"
import type { InstitutionUpdateInput } from "../../app/(locale)/(private)/institutions/[id]/schema/institutionSchema"

export function useUpdateInstitution(id: string) {
  const qc = useQueryClient()
  return useMutation<InstitutionDto, Error, InstitutionUpdateInput>({
    mutationFn: (input) => updateInstitution(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution", id] })
      qc.invalidateQueries({
        queryKey: ["institution", id, "summary"],
      })
    },
  })
}
