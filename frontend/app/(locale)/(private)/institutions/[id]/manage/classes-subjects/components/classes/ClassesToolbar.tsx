// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/ClassesToolbar.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type Props = {
  onSearchChange: (v: string) => void
  onCreateClick: () => void
  loading?: boolean
}

export default function ClassesToolbar({
  onSearchChange,
  onCreateClick,
  loading,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="max-w-sm flex-1">
        <Input
          placeholder="Buscar turma por nome, ID ou descrição..."
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar turmas"
        />
      </div>

      <Button onClick={onCreateClick} disabled={loading}>
        <Plus className="mr-2 h-4 w-4" />
        Nova turma
      </Button>
    </div>
  )
}
