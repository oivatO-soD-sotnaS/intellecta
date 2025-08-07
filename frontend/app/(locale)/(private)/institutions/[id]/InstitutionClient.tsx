// app/(locale)/(private)/institutions/[id]/InstitutionClient.tsx
"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useInstitutionSummary } from "@/hooks/institution/useInstitutionSummary"
import Overview from "./components/Overview"
import CoursesList from "./components/CoursesList"
import { Card, CardBody, CardHeader, } from "@heroui/card"
import { Separator } from "@radix-ui/react-select"


interface InstitutionClientProps{
  id: string
}


export default function InstitutionClient({id}: InstitutionClientProps) {
  const {
    data: summary,
    isLoading: loadingSummary,
    isError: errorSummary,
  } = useInstitutionSummary(id!)

  if (loadingSummary) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="animate-pulse text-gray-500">Carregando dados...</span>
      </div>
    )
  }

  if (errorSummary || !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-600">Erro ao carregar a instituição.</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Sessão: Visão Geral */}
      <Card>
        <CardHeader>
          <h1>Visão Geral</h1>
        </CardHeader>
        <CardBody>
          <Overview summary={summary} />
        </CardBody>
      </Card>

      {/* Separator opcional */}
      <Separator />

      {/* Sessão: Disciplinas */}
      <Card>
        <CardHeader>
          <h1>Suas Disciplinas</h1>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CoursesList />
          </div>
        </CardBody>
      </Card>

      <Separator />

      {/* Sessão: Calendário e Próximos Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h1>Calendário</h1>
          </CardHeader>
          <CardBody>
            {/* <Calendar institutionId={id!} /> */}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h1>Próximos Eventos</h1>
          </CardHeader>
          <CardBody>
            {/* <EventsList institutionId={id!} /> */}
          </CardBody>
        </Card>
      </div>

      <Separator />

      {/* Sessão: Atividades Recentes */}
      <Card>
        <CardHeader>
          <h1>Atividades Recentes</h1>
        </CardHeader>
        <CardBody>
          {/* <RecentActivities institutionId={id!} /> */}
        </CardBody>
      </Card>
    </div>
  )
}
