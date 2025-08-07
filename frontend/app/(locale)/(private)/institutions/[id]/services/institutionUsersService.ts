// app/(locale)/(private)/institution/[id]/services/institutionUsersService.ts
import { institutionUserSchema } from "../schema/institutionUserSchema"
import type { InstitutionUserDto } from "../schema/institutionUserSchema"

const BASE_USERS = "/api/institutions"

export async function fetchInstitutionUsers(
  id: string
): Promise<InstitutionUserDto[]> {
  const res = await fetch(`${BASE_USERS}/${id}/users`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erro ao buscar membros da instituição.")
  const json = await res.json()
  return institutionUserSchema.array().parse(json)
}

export async function inviteUsers(
  id: string,
  invites: string[]
): Promise<void> {
  const res = await fetch(`${BASE_USERS}/${id}/users/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invites }),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erro ao enviar convites.")
}

export async function changeUserRole(
  id: string,
  institutionUserId: string,
  newRole: "admin" | "teacher" | "student"
): Promise<InstitutionUserDto> {
  const res = await fetch(
    `${BASE_USERS}/${id}/users/${institutionUserId}/change-role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_role: newRole }),
      credentials: "include",
    }
  )
  if (!res.ok) throw new Error("Erro ao alterar papel do usuário.")
  const json = await res.json()
  return institutionUserSchema.parse(json)
}

export async function removeInstitutionUser(
  id: string,
  institutionUserId: string
): Promise<void> {
  const res = await fetch(`${BASE_USERS}/${id}/users/${institutionUserId}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Erro ao remover usuário.")
  }
}
