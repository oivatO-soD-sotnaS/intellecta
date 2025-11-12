// app/(institutions)/[id]/invite/InviteManageClient.tsx
"use client"

import * as React from "react"
import { useMemo, useState, useCallback } from "react"
import { toast } from "@heroui/theme"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"
import { InviteResponse } from "@/hooks/invitations/useInviteUsersRaw"

import type { InstitutionUserDto } from "@/types/institution"
import { mapInstitutionUserList } from "@/lib/mappers"
import InviteForm from "./InviteForm"
import { MembersPanel } from "./MembersPanel"

type SortKey = "name-asc" | "name-desc" | "role" | "joinedAt-desc"
type RoleFilter = "all" | "admin" | "teacher" | "student"

export default function InviteManageClient({ institutionId }: { institutionId: string }) {
  const { data: rawUsers, isLoading, isError, refetch } = useInstitutionUsers(institutionId)

  // 1) Normaliza SEMPRE que a hook retornar algo
  const usersDto = useMemo<InstitutionUserDto[]>(
    () => mapInstitutionUserList(rawUsers ?? []),
    [rawUsers]
  )

  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("name-asc")
  const [recent, setRecent] = useState<InviteResponse[]>([])

  const onInvited = useCallback((items: InviteResponse[]) => {
    setRecent((prev) => [...items, ...prev].slice(0, 12))
    toast({ title: `Convites enviados: ${items.length}` })
    refetch()
  }, [refetch])

  // 2) Contadores com DTOs
  const counts = useMemo(() => {
    const base = { admin: 0, teacher: 0, student: 0, total: 0 }
    for (const u of usersDto) {
      if (u.role === "admin") base.admin++
      else if (u.role === "teacher") base.teacher++
      else base.student++
      base.total++
    }
    return base
  }, [usersDto])

  // 3) Filtro + ordenação usando DTOs
  const filtered = useMemo(() => {
    const list = usersDto.filter((u) => {
      const matchText =
        q.trim().length === 0 ||
        u.user.fullName?.toLowerCase().includes(q.toLowerCase()) ||
        u.user.email?.toLowerCase().includes(q.toLowerCase())
      const matchRole = roleFilter === "all" || u.role === roleFilter
      return matchText && matchRole
    })

    switch (sortKey) {
      case "name-asc":
        return list.sort((a, b) => (a.user.fullName || "").localeCompare(b.user.fullName || ""))
      case "name-desc":
        return list.sort((a, b) => (b.user.fullName || "").localeCompare(a.user.fullName || ""))
      case "role":
        return list.sort((a, b) => a.role.localeCompare(b.role))
      case "joinedAt-desc":
        return list.sort((a, b) => (b.joinedAt || "").localeCompare(a.joinedAt || ""))
      default:
        return list
    }
  }, [usersDto, q, roleFilter, sortKey])

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Membros da instituição</h1>
        <p className="text-sm text-muted-foreground">Convide pessoas e gerencie quem já faz parte.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <InviteForm institutionId={institutionId} />
          {/* se quiser usar onInvited:
             <InviteForm institutionId={institutionId} onInvited={onInvited} />
             e ajuste o InviteForm para aceitar essa prop opcional */}
          {/* RecentInvitesPanel(recent) pode continuar aqui se estiver usando */}
        </div>

        <MembersPanel
          users={filtered}           
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          q={q}
          setQ={setQ}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          sortKey={sortKey}
          setSortKey={setSortKey}
          counts={counts}
          institutionId={institutionId}
        />
      </div>
    </div>
  )
}
