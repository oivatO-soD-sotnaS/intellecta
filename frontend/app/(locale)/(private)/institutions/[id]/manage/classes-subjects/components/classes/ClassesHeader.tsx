// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/ClassesHeader.tsx
"use client"

import { Badge } from "@heroui/badge"
import Back from "../../../_components/Back"



export default function ClassesHeader({
  total,
  institutionId,
}: {
  total: number
  institutionId: string
}) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Turmas da Instituição
        </h1>
        <Back hrefFallback={`/institutions/${institutionId}/manage`} />
      </div>

      <p className="text-sm text-muted-foreground">
        Gerencie as turmas. Crie, edite, remova e acesse as disciplinas.
      </p>

      <div>
        <Badge variant="solid" className="rounded-full">
          {total} turma{total === 1 ? "" : "s"}
        </Badge>
      </div>
    </header>
  )
}
