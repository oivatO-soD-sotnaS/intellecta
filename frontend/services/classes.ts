// services/classes.ts
import type {
  ClassDTO,
  CreateClassInput,
  UpdateClassInput,
} from "@/types/class"

export async function getClasses(institutionId: string): Promise<ClassDTO[]> {
  const res = await fetch(`/api/v1/institutions/${institutionId}/classes`, {
    method: "GET",
  })
  if (res.status === 404) return [] 
  if (!res.ok) throw new Error("Falha ao listar turmas")
  return res.json()
}

export async function getClass(
  institutionId: string,
  classId: string
): Promise<ClassDTO> {
  const res = await fetch(
    `/api/v1/institutions/${institutionId}/classes/${classId}`,
    {
      method: "GET",
    }
  )
  if (!res.ok) throw new Error("Falha ao obter turma")
  return res.json()
}

export async function createClass(
  institutionId: string,
  payload: CreateClassInput
): Promise<ClassDTO> {
  const res = await fetch(`/api/v1/institutions/${institutionId}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Falha ao criar turma")
  return res.json()
}

export async function updateClass(
  institutionId: string,
  classId: string,
  payload: UpdateClassInput
): Promise<ClassDTO> {
  const res = await fetch(
    `/api/v1/institutions/${institutionId}/classes/${classId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )
  if (!res.ok) throw new Error("Falha ao atualizar turma")
  return res.json()
}

export async function deleteClass(
  institutionId: string,
  classId: string
): Promise<void> {
  const res = await fetch(
    `/api/v1/institutions/${institutionId}/classes/${classId}`,
    {
      method: "DELETE",
    }
  )
  if (!res.ok) throw new Error("Falha ao excluir turma")
}
