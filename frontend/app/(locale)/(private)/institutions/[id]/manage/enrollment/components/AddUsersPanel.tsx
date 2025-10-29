"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { Search, Filter } from "lucide-react"
import type { InstitutionUser } from "./types"
import { Badge } from "@heroui/badge"
import { Avatar } from "@heroui/avatar"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"

const ROLE_ORDER = ["admin", "professor", "aluno"]

export default function AddUsersPanel({
  institutionUsers,
  onAdd,
}: {
  institutionUsers: InstitutionUser[]
  onAdd: (userIds: string[]) => void
}) {
  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | "all">("all")
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    let base = [...institutionUsers]
    if (roleFilter !== "all") base = base.filter((iu) => iu.role === roleFilter)
    if (q.trim()) {
      const qq = q.toLowerCase()
      base = base.filter((iu) =>
        [iu.user.full_name, iu.user.email, iu.role]
          .join(" ")
          .toLowerCase()
          .includes(qq)
      )
    }
    // ordenar por papel e nome
    base.sort((a, b) => {
      const ra = ROLE_ORDER.indexOf(a.role)
      const rb = ROLE_ORDER.indexOf(b.role)
      return ra - rb || a.user.full_name.localeCompare(b.user.full_name)
    })
    return base
  }, [institutionUsers, q, roleFilter])

  const toggle = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  const clearSel = () => setSelected({})
  const selectedIds = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected]
  )

  const handleAdd = () => {
    if (!selectedIds.length) return
    onAdd(selectedIds)
    clearSel()
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Adicionar usuários</CardTitle>
        <CardDescription>
          Busque na lista da instituição e matricule na turma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, e-mail ou papel…"
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              <Badge
                variant={roleFilter === "all" ? "faded" : "flat"}
                className="cursor-pointer"
                onClick={() => setRoleFilter("all")}
              >
                Todos
              </Badge>
              {ROLE_ORDER.map((r) => (
                <Badge
                  key={r}
                  variant={roleFilter === r ? "faded" : "flat"}
                  className="capitalize cursor-pointer"
                  onClick={() => setRoleFilter(r)}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="max-h-[360px] overflow-auto rounded-xl border">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground p-4">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((iu) => {
                const id = iu.user.user_id
                const checked = !!selected[id]
                const initials = iu.user.full_name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
                return (
                  <li key={id} className="flex items-center gap-3 p-3">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(id)}
                    />
                    <AppAvatar
                      src={iu.user.profile_picture?.url}
                      name={iu.user.full_name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {iu.user.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {iu.user.email}
                      </div>
                    </div>
                    <Badge variant="flat" className="capitalize">
                      {iu.role}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedIds.length} selecionado(s)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={clearSel}>
              Limpar
            </Button>
            <Button
              className="rounded-xl"
              onClick={handleAdd}
              disabled={selectedIds.length === 0}
            >
              Matricular
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
