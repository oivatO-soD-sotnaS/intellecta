"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSubject } from "@/hooks/subjects/useSubject"
import { Pencil, Unlink, ArrowLeft } from "lucide-react"
import { Avatar } from "@heroui/avatar"
import { Badge } from "@heroui/badge"

type Props = {
  institutionId: string
  subjectId: string
  classId?: string
  onEdit: () => void
  onUnlink?: () => void
  onBack?: () => void
  stats?: { assignments?: number; materials?: number }
}

export default function SubjectHeader({
  institutionId,
  subjectId,
  classId,
  onEdit,
  onUnlink,
  onBack,
  stats,
}: Props) {
  const { data, isLoading } = useSubject(institutionId, subjectId)

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </Card>
    )
  }

  if (!data) return null

  const teacherName = data.teacher?.full_name ?? "Sem professor"
  const teacherEmail = data.teacher?.email
  const avatarProps =
    typeof data.profile_picture === "object" && data.profile_picture?.url
      ? { src: data.profile_picture.url }
      : { name: data.name }

  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            {...avatarProps}
            className="h-12 w-12 text-base"
            radius="full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold">{data.name}</h1>
              {stats?.assignments !== undefined && (
                <Badge variant="solid">Atividades: {stats.assignments}</Badge>
              )}
              {stats?.materials !== undefined && (
                <Badge variant="solid">Materiais: {stats.materials}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Professor: <span className="font-medium">{teacherName}</span>
              {teacherEmail ? ` · ${teacherEmail}` : ""}
            </p>
            {data.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {data.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}

          <Button variant="outline" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar disciplina
          </Button>

          {classId && onUnlink && (
            <Button variant="destructive" onClick={onUnlink}>
              <Unlink className="h-4 w-4 mr-2" />
              Desvincular da turma
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
