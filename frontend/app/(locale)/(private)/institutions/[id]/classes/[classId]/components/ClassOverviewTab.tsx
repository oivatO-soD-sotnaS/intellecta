// app/(locale)/(private)/institutions/[institutionId]/classes/[classId]/ClassOverviewTab.tsx
"use client"

import React from "react"
import { useClassUsers } from "@/hooks/classes/useClassUsers"
// ajuste o import abaixo para o hook real da sua lista de disciplinas
import { useClassSubjects } from "@/hooks/classes/useClassSubjects"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Activity, BookOpen, CalendarClock, Info, Users } from "lucide-react"
import { useClass } from "@/hooks/classes/useClasses"
import { useClassTimeline } from "@/hooks/subjects/timeline/useClassTimeline"

type ClassOverviewTabProps = {
  institutionId: string
  classId: string
}

function formatDateTime(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ClassOverviewTab({
  institutionId,
  classId,
}: ClassOverviewTabProps) {
  const { data: classData, isLoading: isClassLoading } = useClass(
    institutionId,
    classId
  )
  const { data: users, isLoading: isUsersLoading } = useClassUsers(
    institutionId,
    classId
  )
  const { data: subjects, isLoading: isSubjectsLoading } = useClassSubjects(
    institutionId,
    classId
  )
  const {
    data: timeline,
    isLoading: isTimelineLoading,
    error: timelineError,
  } = useClassTimeline(institutionId, classId)

  const totalPeople = users?.length ?? 0
  const totalSubjects = subjects?.length ?? 0
  const timelineItems = timeline ?? []

  // Último evento (mais recente) – timeline já vem ordenada desc
  const lastActivity = timelineItems[0]

  // Próximos eventos: subject_event com data no futuro
  const now = new Date()
  const upcomingEvents = timelineItems
    .filter(
      (item) =>
        item.type === "subject_event" &&
        item.date &&
        new Date(item.date).getTime() >= now.getTime()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  // Atividade recente (mini feed): pega os 5 mais recentes
  const recentActivity = timelineItems.slice(0, 5)

  const isSummaryLoading =
    isClassLoading || isUsersLoading || isSubjectsLoading || isTimelineLoading

  return (
    <div className="space-y-6">
      {/* Cabeçalho da visão geral */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight">
          Visão geral da turma
        </h2>
        <p className="text-xs text-muted-foreground">
          Resumo rápido da turma, participantes, disciplinas e eventos.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pessoas na turma */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              Pessoas na turma
            </CardTitle>
            <CardDescription className="text-[11px]">
              Professores e alunos matriculados.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            {isSummaryLoading ? (
              <Skeleton className="h-7 w-12 rounded-md" />
            ) : (
              <p className="text-2xl font-semibold">
                {totalPeople}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {totalPeople === 1 ? "pessoa" : "pessoas"}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Disciplinas */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Disciplinas
            </CardTitle>
            <CardDescription className="text-[11px]">
              Componentes curriculares vinculados à turma.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            {isSummaryLoading ? (
              <Skeleton className="h-7 w-12 rounded-md" />
            ) : (
              <p className="text-2xl font-semibold">
                {totalSubjects}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {totalSubjects === 1 ? "disciplina" : "disciplinas"}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              Próximos eventos
            </CardTitle>
            <CardDescription className="text-[11px]">
              Avaliações, aulas especiais e lembretes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            {isTimelineLoading ? (
              <Skeleton className="h-7 w-16 rounded-md" />
            ) : (
              <p className="text-2xl font-semibold">
                {upcomingEvents.length}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {upcomingEvents.length === 1 ? "evento" : "eventos"}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Atividade recente */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Atividade recente
            </CardTitle>
            <CardDescription className="text-[11px]">
              Última ação registrada na turma.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            {isTimelineLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-3 w-40 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            ) : lastActivity ? (
              <div className="space-y-1">
                <p className="text-sm font-medium line-clamp-2">
                  {lastActivity.title}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(lastActivity.date)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Linha 2: Atividade recente + Próximos eventos */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Mini feed de atividade recente */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Atividade recente
            </CardTitle>
            <CardDescription className="text-xs">
              Últimos registros da linha do tempo da turma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {isTimelineLoading && (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-md bg-muted/40 px-3 py-2"
                  >
                    <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-40 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isTimelineLoading && recentActivity.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhuma atividade registrada ainda. Conforme pessoas,
                disciplinas e eventos forem adicionados, eles aparecerão aqui.
              </p>
            )}

            {!isTimelineLoading &&
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-md bg-muted/40 px-3 py-2"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border/60">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-medium leading-snug">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {formatDateTime(item.date)}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card className="border-border/70 bg-card/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Próximos eventos
            </CardTitle>
            <CardDescription className="text-xs">
              Eventos futuros das disciplinas desta turma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {isTimelineLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-md bg-muted/40 px-3 py-2"
                  >
                    <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-40 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isTimelineLoading && upcomingEvents.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhum evento futuro cadastrado ainda.
              </p>
            )}

            {!isTimelineLoading &&
              upcomingEvents.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-md bg-muted/40 px-3 py-2"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border/60">
                    <CalendarClock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-medium leading-snug">
                      {item.title}
                    </p>
                    {item.meta?.subject && (
                      <p className="text-[11px] text-muted-foreground">
                        Disciplina:{" "}
                        <span className="font-medium">
                          {item.meta.subject.name}
                        </span>
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {formatDateTime(item.date)}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Linha 3: Disciplinas */}
      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Disciplinas da turma
          </CardTitle>
          <CardDescription className="text-xs">
            Visão geral das disciplinas vinculadas a esta turma.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {isSubjectsLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2"
                >
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
              ))}
            </div>
          )}

          {!isSubjectsLoading && (!subjects || subjects.length === 0) && (
            <p className="text-xs text-muted-foreground">
              Nenhuma disciplina vinculada a esta turma ainda.
            </p>
          )}

          {!isSubjectsLoading && subjects && subjects.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">
                      Nome da disciplina
                    </TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.subject.subject_id}>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {subject.subject.name}
                            </span>

                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {subject.subject.description || "Sem descrição."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
