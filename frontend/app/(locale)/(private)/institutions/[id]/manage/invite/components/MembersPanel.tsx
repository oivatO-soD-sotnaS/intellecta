"use client"

import * as React from "react"
import { Input } from "@heroui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InstitutionUserDto } from "@/types/institution"
import MembersList from "./MembersList"

type SortKey = "name-asc" | "name-desc" | "role" | "joinedAt-desc"
type RoleFilter = "all" | "admin" | "teacher" | "student"

export function MembersPanel(props: {
  users: InstitutionUserDto[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  q: string
  setQ: (v: string) => void
  roleFilter: RoleFilter
  setRoleFilter: (v: RoleFilter) => void
  sortKey: SortKey
  setSortKey: (v: SortKey) => void
  counts: { admin: number; teacher: number; student: number; total: number }
  institutionId: string
}) {
  const {
    users,
    isLoading,
    isError,
    onRetry,
    q,
    setQ,
    roleFilter,
    setRoleFilter,
    sortKey,
    setSortKey,
    counts,
    institutionId,
  } = props

  return (
    <Card className="p-4 space-y-4">
      {/* Header: filtros e contadores */}
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou e-mail"
        />

        <div className="flex items-center justify-end gap-2">
          {/* Filtro por papel */}
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as RoleFilter)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenação */}
          <Select
            value={sortKey}
            onValueChange={(v) => setSortKey(v as SortKey)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nome (A→Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z→A)</SelectItem>
              <SelectItem value="role">Papel</SelectItem>
              <SelectItem value="joinedAt-desc">Mais recentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contadores */}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border px-2 py-1">
          Total: <b>{counts.total}</b>
        </span>
        <span className="rounded-md border px-2 py-1">
          Admin: <b>{counts.admin}</b>
        </span>
        <span className="rounded-md border px-2 py-1">
          Teacher: <b>{counts.teacher}</b>
        </span>
        <span className="rounded-md border px-2 py-1">
          Student: <b>{counts.student}</b>
        </span>
      </div>

      {/* Lista de membros (read-only) */}
      <MembersList
        users={users}
        id={institutionId}
        readOnly
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
      />
    </Card>
  )
}
