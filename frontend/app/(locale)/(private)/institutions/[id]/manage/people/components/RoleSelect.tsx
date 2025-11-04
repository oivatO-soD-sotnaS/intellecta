// app/(locale)/(private)/institutions/[id]/manage/people/_components/RoleSelect.tsx
"use client"

import * as React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Props = {
  value: "admin" | "teacher" | "student" | string
  onChange: (v: "admin" | "teacher" | "student") => void
  disabled?: boolean
}

export default function RoleSelect({ value, onChange, disabled }: Props) {
  const normalized = (
    ["admin", "teacher", "student"].includes(value) ? value : "student"
  ) as "admin" | "teacher" | "student"

  return (
    <Select
      value={normalized}
      onValueChange={(v) => onChange(v as any)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="teacher">Professor</SelectItem>
        <SelectItem value="student">Aluno</SelectItem>
      </SelectContent>
    </Select>
  )
}
