// app/(locale)/(private)/institutions/[id]/manage/events/_components/SubjectPicker.tsx
"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSubject } from "@/hooks/subjects/useSubject"

type Props = {
  institutionId: string
  value?: string
  onValueChange: (v?: string) => void
  className?: string
}

export default function SubjectPicker({
  institutionId,
  value,
  onValueChange,
  className,
}: Props) {
  const { data, isLoading } = useSubject(institutionId)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={value ?? ""}
        onValueChange={(v) => onValueChange(v || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              isLoading ? "Carregando..." : "Selecione uma disciplina"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">—</SelectItem>
          {(data ?? []).map((s) => (
            <SelectItem key={s.subject_id} value={s.subject_id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
