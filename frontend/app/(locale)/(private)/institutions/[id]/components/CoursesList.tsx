// app/(locale)/(private)/institution/[id]/components/CoursesList.tsx
"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardBody } from "@heroui/card"
import { ClipboardList, FileText } from "lucide-react"
import { useInstitutionSubjects } from "@/hooks/institution/useInstitutionSubjects"
import type { SubjectDto } from "../schema/subjectSchema"

export default function CoursesList() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id!
  const { data: subjects, isLoading, error } = useInstitutionSubjects(id)

  if (isLoading) return <div>Carregando disciplinas…</div>

    if (error)
    return <div className="text-red-600">Erro ao carregar disciplinas.</div>

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-xl font-semibold">Suas Disciplinas</h2>
        <Link
          href={`/institution/${id}/courses`}
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          Ver todas &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {subjects!.map((disc: SubjectDto) => (
          <Card
            key={disc.subjectId}
            className="overflow-hidden rounded-2xl shadow-sm"
          >
            <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-500" />
            <CardBody className="pt-5 pb-6 px-5">
              <h3 className="text-lg font-semibold">{disc.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{disc.teacherName}</p>

              <div className="flex gap-6 mb-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <ClipboardList className="mr-1" size={16} />
                  {disc.activitiesCount} atividades
                </span>
                <span className="flex items-center">
                  <FileText className="mr-1" size={16} />
                  {disc.materialsCount} materiais
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600"
                  style={{ width: `${disc.progress}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs font-medium text-gray-700">
                {disc.progress}%
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  )
}
