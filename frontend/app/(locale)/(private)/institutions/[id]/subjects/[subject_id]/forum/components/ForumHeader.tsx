// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumHeader.tsx

import { Badge } from "@heroui/badge"
import { Megaphone, RefreshCw } from "lucide-react"

type ForumHeaderProps = {
  totalCount: number
  isFetching: boolean
}

export function ForumHeader({ totalCount, isFetching }: ForumHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Instituições</span>
        <span className="text-muted-foreground/60">/</span>
        <span>Disciplinas</span>
        <span className="text-muted-foreground/60">/</span>
        <span className="font-medium text-foreground">Fórum</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Fórum da disciplina
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Espaço para avisos e comunicados oficiais do professor para a turma.
            Todos os alunos podem visualizar as mensagens.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <Badge variant="solid" className="flex items-center gap-1">
            <Megaphone className="h-3 w-3" />
            <span>{totalCount}</span>
            <span className="hidden sm:inline">mensagens</span>
          </Badge>
          {isFetching && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Atualizando…
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
