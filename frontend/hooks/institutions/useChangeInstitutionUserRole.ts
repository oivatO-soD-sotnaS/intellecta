// hooks/institutions/useChangeInstitutionUserRole.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

type ChangeRolePayload = { role: "admin" | "teacher" | "student" | string }

async function patchChangeRole(
  institutionId: string,
  institutionUserId: string,
  payload: ChangeRolePayload
) {
  const res = await fetch(
    `/api/institutions/${institutionId}/users/${institutionUserId}/change-role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Falha ao alterar papel: ${res.status} ${text}`)
  }
  return res.json()
}

export function useChangeInstitutionUserRole(institutionId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      institution_user_id: string
      role: ChangeRolePayload["role"]
    }) =>
      patchChangeRole(institutionId, vars.institution_user_id, {
        role: vars.role,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["institution-users", institutionId] })
    },
  })
}
