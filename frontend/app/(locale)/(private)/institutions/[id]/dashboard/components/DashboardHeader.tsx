"use client"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import Today from "./Today";
const f = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

type Props = {
  name?: string 
  subtitle?: string 
}

export default function DashboardHeader({
  name = "Ana",
  subtitle = "Bem-vinda de volta à sua plataforma educacional.",
}: Props) {
  const { data: me } = useCurrentUser() 

  const firstName = me?.full_name.split(" ")[0]


  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Olá, {firstName}!</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

    <div className="shrink-0 text-right">
      <p className="text-xs text-muted-foreground">Hoje é</p>
      <Today className="text-sm font-medium text-primary" />
    </div>
    </div>
  )
}
