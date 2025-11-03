"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@heroui/avatar"

type Candidate = {
  user_id: string
  name: string
  email: string
  avatar?: string
}

export default function AddUsersPanel({
  disabled,
  loading,
  users,
  selected,
  onToggle,
  onAdd,
  adding,
}: {
  disabled?: boolean
  loading?: boolean
  users: Candidate[]
  selected: string[]
  onToggle: (id: string, checked: boolean) => void
  onAdd: () => void
  adding?: boolean
}) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [users, query])

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4">
      <h3 className="mb-2 text-sm font-medium">Adicionar usuários</h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Selecione usuários da instituição para matricular na turma escolhida.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome ou e-mail…"
        className={cn(
          "mb-3 h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        )}
        disabled={disabled || loading}
      />

      <div className="max-h-72 space-y-2 overflow-auto pr-1">
        {loading ? (
          <div className="text-xs text-muted-foreground">Carregando…</div>
        ) : filtered.length ? (
          filtered.map((u) => {
            const checked = selected.includes(u.user_id)
            const initials =
              u.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U"

            return (
              <label
                key={u.user_id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md border border-transparent px-2 py-1.5",
                  "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <Avatar src={u.avatar} className="h-8 w-8" />
                  ) : (
                    <Avatar className="h-8 w-8">{initials}</Avatar>
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{u.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="h-4 w-4 accent-foreground"
                  checked={checked}
                  onChange={(e) => onToggle(u.user_id, e.target.checked)}
                  disabled={disabled}
                />
              </label>
            )
          })
        ) : (
          <div className="text-xs text-muted-foreground">
            {query ? "Nenhum usuário encontrado." : "Sem usuários disponíveis."}
          </div>
        )}
      </div>

      <button
        onClick={onAdd}
        disabled={disabled || adding || selected.length === 0}
        className={cn(
          "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background",
          "hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <Plus className="h-4 w-4" />
        Adicionar selecionados
      </button>
    </div>
  )
}
