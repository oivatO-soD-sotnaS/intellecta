// app/(locale)/(private)/institution/[id]/services/institutionUsersService.ts
import { institutionUserSchema } from "../schema/institutionUserSchema"
import type { InstitutionUserDto } from "../schema/institutionUserSchema"

const BASE = "/api/institutions"

export async function fetchInstitutionUsers(
  institutionId: string
): Promise<InstitutionUserDto[]> {
  const res = await fetch(`${BASE}/${institutionId}/users`)
  if (!res.ok) throw new Error("Erro ao buscar membros da instituição.")
  const json = await res.json()
  return institutionUserSchema.array().parse(json)
}

export async function inviteUsers(
  institutionId: string,
  invites: string[]
): Promise<void> {
  const res = await fetch(`${BASE}/${institutionId}/users/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invites }),
  })
  if (!res.ok) throw new Error("Erro ao enviar convites.")
}

export async function changeUserRole(
  institutionId: string,
  institutionUserId: string,
  newRole: "admin" | "teacher" | "student"
): Promise<InstitutionUserDto> {
  const res = await fetch(
    `${BASE}/${institutionId}/users/${institutionUserId}/change-role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_role: newRole }),
    }
  )
  if (!res.ok) throw new Error("Erro ao alterar papel do usuário.")
  const json = await res.json()
  return institutionUserSchema.parse(json)
}

export async function removeInstitutionUser(
  institutionId: string,
  institutionUserId: string
): Promise<void> {
  const res = await fetch(
    `${BASE}/${institutionId}/users/${institutionUserId}`,
    { method: "DELETE" }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Erro ao remover usuário.")
  }
}
