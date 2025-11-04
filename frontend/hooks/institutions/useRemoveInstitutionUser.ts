// hooks/institutions/useRemoveInstitutionUser.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

async function deleteInstitutionUser(
  institutionId: string,
  institutionUserId: string
) {
  const res = await fetch(
    `/api/institutions/${institutionId}/users/${institutionUserId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao remover usuário: ${res.status} ${text}`)
  }
  return true
}

export function useRemoveInstitutionUser(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (institution_user_id: string) =>
      deleteInstitutionUser(institutionId, institution_user_id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution-users", institutionId] })
    },
  })
}
