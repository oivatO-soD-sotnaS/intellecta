import { useQuery } from "@tanstack/react-query"
import { SubjectLite } from "../classes/useClassSubjects"
import { apiGet } from "@/lib/apiClient"

/**
 * Soma o total de disciplinas em várias instituições.
 *
 * Recebe um array de institutionIds e:
 *  - chama /api/institutions/{id}/subjects para cada uma
 *  - soma o length de cada resposta
 *
 * Útil para mostrar o total de disciplinas no ProfileCard.
 */
export function useSubjectsCountByInstitutions(institutionIds: string[]) {
  return useQuery({
    queryKey: ["subjects-count", { institutionIds }],
    enabled: institutionIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        institutionIds.map((id) =>
          apiGet<SubjectLite[]>(`/api/institutions/${id}/subjects`)
        )
      )

      return results.reduce((acc, subjects) => acc + subjects.length, 0)
    },
  })
}
