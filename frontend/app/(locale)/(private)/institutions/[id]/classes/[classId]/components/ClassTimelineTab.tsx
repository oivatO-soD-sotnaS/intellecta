"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, BookOpen, UserPlus, CalendarClock } from "lucide-react"
import { ClassTimelineItem } from "@/hooks/subjects/timeline/types"
import { useClassTimeline } from "@/hooks/subjects/timeline/useClassTimeline"

type ClassTimelineTabProps = {
  institutionId: string
  classId: string
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "Data inválida"

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getTypeConfig(item: ClassTimelineItem) {
  switch (item.type) {
    case "class_created":
      return {
        label: "Turma",
        icon: Clock,
        badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/30",
        dotClass: "bg-blue-500",
      }
    case "user_joined":
      return {
        label: "Pessoa",
        icon: UserPlus,
        badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
        dotClass: "bg-emerald-500",
      }
    case "subject_created":
      return {
        label: "Disciplina",
        icon: BookOpen,
        badgeClass: "bg-violet-500/10 text-violet-500 border-violet-500/30",
        dotClass: "bg-violet-500",
      }
    case "subject_event":
      return {
        label: "Evento",
        icon: CalendarClock,
        badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/30",
        dotClass: "bg-amber-500",
      }
    default:
      return {
        label: "Outro",
        icon: Clock,
        badgeClass: "bg-muted text-muted-foreground border-border/40",
        dotClass: "bg-muted-foreground",
      }
  }
}

export function ClassTimelineTab({
  institutionId,
  classId,
}: ClassTimelineTabProps) {
  const {
    data: timeline,
    isLoading,
    error,
  } = useClassTimeline(institutionId, classId)

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Erro ao carregar a linha do tempo da turma:
        <span className="font-semibold"> {error.message}</span>
      </div>
    )
  }

  const items = timeline ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight">
          Linha do tempo da turma
        </h2>
        <p className="text-xs text-muted-foreground">
          Acompanhe a história da turma: criação, entrada de pessoas,
          disciplinas e eventos.
        </p>
      </div>

      {isLoading && items.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-lg border border-border/60 bg-card/60 px-4 py-3"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-40 rounded bg-muted" />
                <div className="h-3 w-64 rounded bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="rounded-lg border border-border/60 bg-card/60 px-4 py-6 text-center">
          <p className="text-sm font-medium">Nenhum evento encontrado.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Assim que disciplinas, pessoas e eventos forem adicionados, eles
            aparecerão aqui em ordem cronológica.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <ol className="relative space-y-4 border-l border-border/50 pl-4">
          {items.map((item, index) => {
            const cfg = getTypeConfig(item)
            const Icon = cfg.icon

            return (
              <li key={item.id} className="relative pl-2">
                {/* Pontinho da timeline */}
                <span
                  className={cn(
                    "absolute -left-[9px] top-2 h-3 w-3 rounded-full ring-2 ring-background",
                    cfg.dotClass
                  )}
                />

                <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card/70 px-3 py-2 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {item.title}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "h-6 border text-[10px] font-semibold uppercase tracking-wide",
                        cfg.badgeClass
                      )}
                    >
                      {cfg.label}
                    </Badge>
                  </div>

                  {item.description && (
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDateTime(item.date)}
                    </span>

                    {/* Info extra (ex.: disciplina ou usuário) */}
                    {item.meta?.subject && (
                      <span className="text-[11px] text-muted-foreground">
                        Disciplina:{" "}
                        <span className="font-medium">
                          {item.meta.subject.name}
                        </span>
                      </span>
                    )}

                    {item.meta?.user && !item.meta?.subject && (
                      <span className="text-[11px] text-muted-foreground">
                        Usuário:{" "}
                        <span className="font-medium">
                          {item.meta.user.full_name}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Linha ligando para o próximo item (só para não ficar cortado visualmente) */}
                {index === items.length - 1 && (
                  <div className="absolute left-[-1px] top-6 h-4 w-px bg-gradient-to-b from-border/70 to-transparent" />
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
