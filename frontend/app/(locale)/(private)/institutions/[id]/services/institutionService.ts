// app/(locale)/(private)/institution/[id]/services/institutionService.ts
import {
  institutionSchema,
  institutionSummarySchema,
  institutionUpdateSchema,
} from "../schema/institutionSchema"
import type {
  InstitutionDto,
  InstitutionSummaryDto,
  InstitutionUpdateInput,
} from "../schema/institutionSchema"
import { SubjectDto, subjectSchema } from "../schema/subjectSchema"

const BASE = "/api/institutions"

export async function fetchInstitutionById(id: string) {
  const res = await fetch(`/api/institutions/${id}`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Erro ao buscar instituição")
  return res.json()
}



export async function fetchInstitutionSummary(id: string) {
  const res = await fetch(`/api/institutions/${id}/summary`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Erro ao buscar resumo da instituição")
  return res.json()
}




export async function fetchInstitutionSubjects(
  id: string
): Promise<SubjectDto[]> {
  const res = await fetch(`${BASE}/${id}/subjects`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erro ao carregar disciplinas da instituição.")
  const rawList = await res.json()
  return (rawList as any[]).map((raw) =>
    subjectSchema.parse({
      subjectId: raw.subjectId, 
      name: raw.name,
      teacherName: raw.teacherName,
      activitiesCount: raw.activitiesCount,
      materialsCount: raw.materialsCount,
      progress: raw.progress ?? 0,
    })
  )
}

export async function updateInstitution(
  id: string,
  input: InstitutionUpdateInput
): Promise<InstitutionDto> {
  const body = institutionUpdateSchema.parse(input)
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erro ao atualizar instituição")
  const json = await res.json()
  return institutionSchema.parse(json)
}
