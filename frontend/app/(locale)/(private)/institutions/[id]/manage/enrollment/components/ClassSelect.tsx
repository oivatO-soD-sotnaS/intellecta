"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import type { ClassSummary } from "./types"

export default function ClassSelect({
  classes,
  value,
  onChange,
}: {
  classes: ClassSummary[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="max-w-sm">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Selecione uma turma" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((c) => (
            <SelectItem key={c.class_id} value={c.class_id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
