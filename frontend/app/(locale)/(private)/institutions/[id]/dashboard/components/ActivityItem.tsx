"use client"

import { Card } from "@/components/ui/card"
import {
  FileText,
  Paperclip,
  MessagesSquare,
  ClipboardList,
} from "lucide-react"
import { Badge } from "@heroui/badge"
import { RecentActivity } from "../_mocks/activities.mock"

function KindIcon({ kind }: { kind: RecentActivity["kind"] }) {
  const base = "grid size-10 place-items-center rounded-xl"
  if (kind === "atividade")
    return (
      <div className={`${base} bg-violet-100 text-violet-600`}>
        <ClipboardList className="size-5" />
      </div>
    )
  if (kind === "material")
    return (
      <div className={`${base} bg-blue-100 text-blue-600`}>
        <Paperclip className="size-5" />
      </div>
    )
  return (
    <div className={`${base} bg-emerald-100 text-emerald-600`}>
      <MessagesSquare className="size-5" />
    </div>
  )
}

function StatusBadge({ status }: { status?: RecentActivity["status"] }) {
  if (!status) return null
  const map: Record<string, string> = {
    Pendente: "bg-amber-100 text-amber-700",
    Enviado: "bg-teal-100 text-teal-700",
    Novo: "bg-sky-100 text-sky-700",
    Discussão: "bg-emerald-100 text-emerald-700",
  }
  const cls = map[status] ?? "bg-default-100 text-foreground"
  return (
    <Badge className={`rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {status}
    </Badge>
  )
}

export default function ActivityItem({
  activity,
}: {
  activity: RecentActivity
}) {
  return (
    <div
      className={`rounded-xl border border-transparent ${activity.highlighted ? "bg-muted/50" : ""}`}
    >
      <div className="flex items-start gap-4 px-4 py-4">
        <KindIcon kind={activity.kind} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{activity.title}</h3>
            <StatusBadge status={activity.status} />
          </div>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {activity.subject} • {activity.author}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {activity.dateLabel}
          </p>
        </div>
      </div>
    </div>
  )
}
