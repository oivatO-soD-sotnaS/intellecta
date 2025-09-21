"use client"

import { formatDatePtBR } from "@/lib/format" // se já tiver util; senão, use Intl.DateTimeFormat
// fallback simples:
const f = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

type Props = {
  name?: string // "Ana"
  subtitle?: string // "Bem-vinda de volta à sua plataforma educacional."
  date?: Date
}

export default function DashboardHeader({
  name = "Ana",
  subtitle = "Bem-vinda de volta à sua plataforma educacional.",
  date = new Date(),
}: Props) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Olá, {name}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">Hoje é</p>
        <p className="text-sm font-medium text-primary">{today}</p>
      </div>
    </div>
  )
}
