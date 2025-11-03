"use client"

import { UserMinus2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ClassUserRow } from "@/hooks/classes/useClassUsers"
import { Avatar } from "@heroui/avatar"

function initials(name?: string) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function RosterTable({
  loading,
  rows,
  onRemove,
  removing,
  onInspect,
}: {
  loading?: boolean
  rows: ClassUserRow[]
  onRemove: (class_users_id: string) => void
  removing?: boolean
  onInspect?: (userId: string) => void
}) {
  if (loading)
    return <div className="text-sm text-muted-foreground">Carregando…</div>
  if (!rows.length)
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum usuário nesta turma.
      </div>
    )

  return (
    <ul className="divide-y divide-border/60">
      {rows.map((row) => {
        const user = row.user
        const label = user?.full_name || row.user_id
        const email = user?.email ?? ""
        const ava = user?.profile_picture?.url

        return (
          <li
            key={row.class_users_id}
            className={cn(
              "flex items-center justify-between py-3",
              "hover:bg-muted/40 rounded-md px-2 transition-colors"
            )}
          >
            <button
              type="button"
              className="flex flex-1 items-center gap-3 text-left"
              onClick={() => onInspect?.(row.user_id)}
              aria-label={`Ver detalhes de ${label}`}
            >
              {ava ? (
                <Avatar src={ava} className="h-10 w-10" />
              ) : (
                <Avatar className="h-10 w-10">{initials(label)}</Avatar>
              )}

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{label}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
            </button>

            <button
              onClick={() => onRemove(row.class_users_id)}
              disabled={removing}
              className={cn(
                "ml-3 inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2.5 py-1.5 text-xs",
                "text-destructive hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <UserMinus2 className="h-3.5 w-3.5" />
              Remover
            </button>
          </li>
        )
      })}
    </ul>
  )
}
