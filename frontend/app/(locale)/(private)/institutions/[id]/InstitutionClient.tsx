// app/(locale)/(private)/institutions/[id]/InstitutionClient.tsx
"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useInstitutionSummary } from "@/hooks/institution/useInstitutionsSummaries"
import Overview from "./components/Overview"
import CoursesList from "./components/CoursesList"
import { Separator } from "@radix-ui/react-select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"


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
        <CardContent>
          <Overview summary={summary} />
        </CardContent>
      </Card>

      {/* Separator opcional */}
      <Separator />

      {/* Sessão: Disciplinas */}
      <Card>
        <CardHeader>
          <h1>Suas Disciplinas</h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CoursesList />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Sessão: Calendário e Próximos Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h1>Calendário</h1>
          </CardHeader>
          <CardContent>
            {/* <Calendar institutionId={id!} /> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h1>Próximos Eventos</h1>
          </CardHeader>
          <CardContent>
            {/* <EventsList institutionId={id!} /> */}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Sessão: Atividades Recentes */}
      <Card>
        <CardHeader>
          <h1>Atividades Recentes</h1>
        </CardHeader>
        <CardContent>
          {/* <RecentActivities institutionId={id!} /> */}
        </CardContent>
      </Card>
    </div>
  )
}
