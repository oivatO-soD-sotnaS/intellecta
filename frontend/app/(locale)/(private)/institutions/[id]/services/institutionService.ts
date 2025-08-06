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

export async function fetchInstitution(id: string): Promise<InstitutionDto> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error("Erro ao carregar dados da instituição.")
  const json = await res.json()
  return institutionSchema.parse(json)
}

export async function fetchInstitutionSummary(
  id: string
): Promise<InstitutionSummaryDto> {
  const res = await fetch(`${BASE}/${id}/summary`)
  if (!res.ok) throw new Error("Erro ao carregar resumo da instituição.")
  const json = await res.json()
  return institutionSummarySchema.parse(json)
}

export async function fetchInstitutionSubjects(
  institutionId: string
): Promise<SubjectDto[]> {
  const res = await fetch(`/api/institutions/${institutionId}/subjects`)
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
  institutionId: string,
  input: InstitutionUpdateInput
): Promise<InstitutionDto> {
  const body = institutionUpdateSchema.parse(input)
  const res = await fetch(`${BASE}/${institutionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Erro ao atualizar instituição")
  const json = await res.json()
  return institutionSchema.parse(json)
}