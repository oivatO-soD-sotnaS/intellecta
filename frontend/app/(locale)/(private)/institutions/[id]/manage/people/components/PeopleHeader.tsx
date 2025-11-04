// app/(locale)/(private)/institutions/[id]/manage/people/_components/PeopleHeader.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Users, UserCog, Plus } from "lucide-react"
import { Badge } from "@heroui/badge"

type Props = {
  institutionId: string
  total: number
  counts: { admin: number; teacher: number; student: number }
  onBack?: () => void
}

export default function PeopleHeader({
  institutionId,
  total,
  counts,
  onBack,
}: Props) {
  const router = useRouter()

  return (
    <Card className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl md:text-2xl font-semibold">
            Membros da instituição
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {total} membros · <span className="font-medium">{counts.admin}</span>{" "}
          admins · <span className="font-medium">{counts.teacher}</span>{" "}
          professores · <span className="font-medium">{counts.student}</span>{" "}
          alunos
        </p>
        <div className="flex gap-2">
          <Badge variant="solid">Todos: {total}</Badge>
          <Badge>Admins: {counts.admin}</Badge>
          <Badge variant="solid">Professores: {counts.teacher}</Badge>
          <Badge variant="solid">Alunos: {counts.student}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack}>
          <UserCog className="h-4 w-4 mr-2" />
          Gerenciar
        </Button>
        <Button
          onClick={() =>
            router.push(`/institutions/${institutionId}/manage/invite`)
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Convidar pessoas
        </Button>
      </div>
    </Card>
  )
}
