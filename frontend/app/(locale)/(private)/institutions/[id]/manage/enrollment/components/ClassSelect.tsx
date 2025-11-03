"use client"

import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

export default function ClassSelect({
  loading,
  options,
  value,
  onChange,
}: {
  loading?: boolean
  options: Option[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 min-w-[240px] rounded-md border border-input bg-background px-3 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        "disabled:opacity-50"
      )}
      disabled={loading}
    >
      <option value="" disabled>
        {loading ? "Carregando turmas..." : "Selecione uma turma"}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
