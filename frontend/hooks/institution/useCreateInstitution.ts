// hooks/institution/useCreateInstitution.ts
import { useMutation } from "@tanstack/react-query"

export type CreateInstitutionInput = {
  name: string
  description?: string | null
  // IDs/URLs retornados pelos endpoints de upload
  profilePictureId?: string | null
  bannerId?: string | null
}

async function createInstitution(data: CreateInstitutionInput) {
  const res = await fetch("/api/institutions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Falha ao criar instituição: ${res.status} ${text}`)
  }
  return res.json()
}

export function useCreateInstitution() {
  return useMutation({ mutationFn: createInstitution })
}
