// hooks/useUserTurmas.ts
import { useQuery } from "@tanstack/react-query"
import { z } from "zod"

const TurmaSchema = z.object({
  id: z.string(),
  name: z.string(),
})
type Turma = z.infer<typeof TurmaSchema>

export function useUserTurmas() {
  return useQuery<Turma[]>({
    queryKey: ["user", "turmas"],
    queryFn: async () => {
      const res = await fetch("/api/me/turmas")
      if (!res.ok) throw new Error("Falha ao buscar turmas")
      const json = await res.json()
      return z.array(TurmaSchema).parse(json)
    },
  })
}
