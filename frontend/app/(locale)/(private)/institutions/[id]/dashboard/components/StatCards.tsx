"use client"

import { ClipboardCheck, CalendarDays, MessagesSquare } from "lucide-react"
import StatCard from "./StatCard"
import { useInstitutionDashboardSummary } from "@/hooks/institution-page/useInstitutionDashboardSummary"

export default function StatCards() {
  const { data } = useInstitutionDashboardSummary() // mock por enquanto
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <StatCard
        icon={ClipboardCheck}
        value={data.pendingActivities}
        label="Atividades pendentes"
        iconBg="bg-violet-100 text-violet-600"
      />
      <StatCard
        icon={CalendarDays}
        value={data.upcomingEvents}
        label="Eventos próximos"
        iconBg="bg-blue-100 text-blue-600"
      />
      <StatCard
        icon={MessagesSquare}
        value={data.unreadMessages}
        label="Mensagens não lidas"
        iconBg="bg-emerald-100 text-emerald-600"
      />
    </div>
  )
}
