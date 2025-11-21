"use client"

import { useMemo } from "react"
import { useSubjectMaterials } from "@/hooks/subjects/useSubjectMaterials"
import { useSubjectAssignment } from "@/hooks/subjects/assignments/useSubjectAssignments"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ClipboardList,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react"

interface SubjectOverviewTabProps {
  institutionId: string
  subjectId: string
  isTeacher: boolean
  isLoading?: boolean
}

type TimelineItem = {
  id: string
  type: "material" | "assignment"
  title: string
  description: string
  date: Date
}

export default function SubjectOverviewTab({
  institutionId,
  subjectId,
  isTeacher,
  isLoading,
}: SubjectOverviewTabProps) {
  const { data: currentUser } = useCurrentUser()

  const { data: materials, isLoading: isLoadingMaterials } =
    useSubjectMaterials(institutionId, subjectId)

  const { data: assignments, isLoading: isLoadingAssignments } =
    useSubjectAssignment(institutionId, subjectId)

  const loading = isLoading || isLoadingMaterials || isLoadingAssignments

  const {
    totalMaterials,
    lastMaterialDate,
    totalAssignments,
    nextAssignment,
    timelineItems,
  } = useMemo(() => {
    const mats = materials ?? []
    const assigs = assignments ?? []

    const totalMaterials = mats.length
    const totalAssignments = assigs.length

    // último material (por uploaded_at do attachment, se tiver)
    let lastMaterialDate: Date | null = null
    for (const m of mats) {
      const uploadedAtStr = m.attachment?.uploaded_at ?? m.uploaded_at ?? null
      if (uploadedAtStr) {
        const d = new Date(uploadedAtStr)
        if (!lastMaterialDate || d > lastMaterialDate) {
          lastMaterialDate = d
        }
      }
    }

    // próxima atividade (menor due_date futura)
    let nextAssignment: any = null
    const now = new Date()

    for (const a of assigs) {
      const dueStr = a.due_date ?? a.deadline ?? null
      if (!dueStr) continue
      const due = new Date(dueStr)
      // considera só futuro
      if (due >= now) {
        if (!nextAssignment) {
          nextAssignment = a
        } else {
          const currentDue = new Date(
            nextAssignment.due_date ?? nextAssignment.deadline
          )
          if (due < currentDue) {
            nextAssignment = a
          }
        }
      }
    }

    // timeline: materiais + atividades
    const timelineItems: TimelineItem[] = []

    for (const m of mats) {
      const id = m.material_id ?? m.id
      const title =
        m.title ?? m.name ?? m.attachment?.filename ?? "Material publicado"
      const description =
        m.description ??
        (m.attachment?.mime_type
          ? `Material (${m.attachment.mime_type})`
          : "Material da disciplina.")
      const dateStr = m.attachment?.uploaded_at ?? m.uploaded_at ?? null
      if (!dateStr) continue
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) continue

      timelineItems.push({
        id: `material-${id}`,
        type: "material",
        title,
        description,
        date,
      })
    }

    for (const a of assigs) {
      const id = a.assignment_id ?? a.id
      const title = a.title ?? a.name ?? "Atividade criada na disciplina"
      const description =
        a.description ?? "Atividade avaliativa cadastrada pelo professor."
      // se não tiver created_at, usamos due_date só para ordenar
      const dateStr = a.created_at ?? a.due_date ?? a.deadline ?? null
      if (!dateStr) continue
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) continue

      timelineItems.push({
        id: `assignment-${id}`,
        type: "assignment",
        title,
        description,
        date,
      })
    }

    // ordena do mais recente para o mais antigo
    timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime())

    return {
      totalMaterials,
      lastMaterialDate,
      totalAssignments,
      nextAssignment,
      timelineItems: timelineItems.slice(0, 8), // limita pra não virar uma bíblia
    }
  }, [materials, assignments])

  return (
    <section className="space-y-4">
      {/* Linha de cards resumo */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Materiais */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-semibold">{totalMaterials}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalMaterials === 0 && "Nenhum material cadastrado ainda."}
                  {totalMaterials > 0 && lastMaterialDate && (
                    <>
                      Último adicionado em{" "}
                      {lastMaterialDate.toLocaleDateString()}
                    </>
                  )}
                  {totalMaterials > 0 && !lastMaterialDate && (
                    <>Materiais disponíveis para a disciplina.</>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-semibold">{totalAssignments}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalAssignments === 0 &&
                    "Nenhuma atividade cadastrada ainda."}
                  {totalAssignments > 0 &&
                    "Acompanhe as tarefas e avaliações na aba Atividades."}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Próxima atividade */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próxima atividade
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : nextAssignment ? (
              <>
                <p className="line-clamp-2 text-sm font-medium">
                  {nextAssignment.title ??
                    nextAssignment.name ??
                    "Atividade da disciplina"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Entrega até{" "}
                  {new Date(
                    nextAssignment.due_date ?? nextAssignment.deadline
                  ).toLocaleString()}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 flex items-center gap-1 text-xs"
                >
                  Ver atividade
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhuma atividade futura com prazo definido.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card adaptável: professor x aluno */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isTeacher ? "Visão do professor" : "Visão do aluno"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            ) : isTeacher ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Gerencie materiais, crie atividades e acompanhe as entregas
                  dos alunos nas abas ao lado.
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/80">
                  Use a aba <strong>Atividades</strong> para ver as submissões e
                  avaliar as entregas.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Acompanhe os materiais publicados, veja as atividades e envie
                  suas entregas diretamente por aqui.
                </p>
                {currentUser && (
                  <p className="mt-1 text-[11px] text-muted-foreground/80">
                    Você está conectado como{" "}
                    <span className="font-medium">
                      {currentUser.full_name ?? currentUser.email}
                    </span>
                    .
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline de eventos da disciplina */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            O que está acontecendo na disciplina
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="mt-1 h-5 w-5 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          ) : timelineItems.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Ainda não há histórico de materiais ou atividades nesta
              disciplina.
            </p>
          ) : (
            <div className="relative space-y-4">
              <div className="absolute left-[9px] top-0 bottom-0 hidden w-px bg-border/70 md:block" />
              {timelineItems.map((item, index) => {
                const isLast = index === timelineItems.length - 1
                const formattedDate = item.date.toLocaleString()

                const icon =
                  item.type === "material" ? (
                    <BookOpen className="h-3.5 w-3.5" />
                  ) : (
                    <ClipboardList className="h-3.5 w-3.5" />
                  )

                const label =
                  item.type === "material"
                    ? "Material publicado"
                    : "Atividade criada"

                return (
                  <div key={item.id} className="relative flex gap-3 md:pl-4">
                    <div className="relative mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background text-[10px] text-muted-foreground">
                      {icon}
                      {!isLast && (
                        <div className="absolute left-1/2 top-5 hidden h-[calc(100%-20px)] w-px -translate-x-1/2 bg-border/60 md:block" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {label}
                        </span>
                        <span>·</span>
                        <span>{formattedDate}</span>
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
