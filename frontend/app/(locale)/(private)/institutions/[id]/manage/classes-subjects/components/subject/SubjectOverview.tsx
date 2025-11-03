"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSubject } from "@/hooks/subjects/useSubject"
import { Mail, UserRound } from "lucide-react"

type Props = {
  institutionId: string
  subjectId: string
}

export default function OverviewPanel({ institutionId, subjectId }: Props) {
  const { data } = useSubject(institutionId, subjectId)
  if (!data) return null

  const teacherName = data.teacher?.full_name ?? "Sem professor"
  const teacherEmail = data.teacher?.email ?? "—"

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Professor responsável</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{teacherName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{teacherEmail}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {data.description || "Sem descrição."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
