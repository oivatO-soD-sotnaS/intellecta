// app/(locale)/(private)/institutions/[id]/manage/people/_components/PeopleBulkBar.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  count: number
  onBulkRole: (role: "admin" | "teacher" | "student") => Promise<void> | void
  onBulkRemove: () => Promise<void> | void
  disabled?: boolean
}

export default function PeopleBulkBar({
  count,
  onBulkRole,
  onBulkRemove,
  disabled,
}: Props) {
  if (count <= 0) return null
  return (
    <Card className="p-3 flex items-center justify-between border-dashed">
      <div className="text-sm">
        <b>{count}</b> selecionado(s)
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkRole("student")}
          disabled={disabled}
        >
          Tornar Aluno
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkRole("teacher")}
          disabled={disabled}
        >
          Tornar Professor
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onBulkRole("admin")}
          disabled={disabled}
        >
          Tornar Admin
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onBulkRemove}
          disabled={disabled}
        >
          Remover em massa
        </Button>
      </div>
    </Card>
  )
}
