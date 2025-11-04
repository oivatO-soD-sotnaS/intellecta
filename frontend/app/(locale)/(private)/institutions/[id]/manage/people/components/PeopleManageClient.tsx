// app/(locale)/(private)/institutions/[id]/manage/people/PeopleManageClient.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  useInstitutionUsers,
  InstitutionUser,
} from "@/hooks/institutions/useInstitutionUsers"
import { useChangeInstitutionUserRole } from "@/hooks/institutions/useChangeInstitutionUserRole"
import { useRemoveInstitutionUser } from "@/hooks/institutions/useRemoveInstitutionUser"
import PeopleHeader from "./PeopleHeader"
import PeopleToolbar from "./PeopleToolbar"
import PeopleTable from "./PeopleTable"
import PeopleBulkBar from "./PeopleBulkBar"
import RemoveUserModal from "./RemoveUserModal"
import EmptyState from "./EmptyState"
import {
  PeopleHeaderSkeleton,
  PeopleTableSkeleton,
} from "./Skeletons"

type RoleFilter = "all" | "admin" | "teacher" | "student"

export default function PeopleManageClient({
  institutionId,
}: {
  institutionId: string
}) {
  const router = useRouter()
  const { data, isLoading } = useInstitutionUsers(institutionId)
  const changeRole = useChangeInstitutionUserRole(institutionId)
  const removeUser = useRemoveInstitutionUser(institutionId)

  // UI state
  const [search, setSearch] = React.useState("")
  const [role, setRole] = React.useState<RoleFilter>("all")
  const [selected, setSelected] = React.useState<string[]>([])
  const [removeOpen, setRemoveOpen] = React.useState(false)
  const [toRemove, setToRemove] = React.useState<InstitutionUser | null>(null)
  const [loadingRowId, setLoadingRowId] = React.useState<string | undefined>(
    undefined
  )

  const rows = React.useMemo(() => data ?? [], [data])

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((r) => {
      const roleOk = role === "all" ? true : r.role === role
      const text =
        `${r.user?.full_name ?? ""} ${r.user?.email ?? ""}`.toLowerCase()
      const termOk = term ? text.includes(term) : true
      return roleOk && termOk
    })
  }, [rows, role, search])

  const counts = React.useMemo(() => {
    const base = { admin: 0, teacher: 0, student: 0 }
    for (const r of rows) {
      if (r.role === "admin") base.admin++
      else if (r.role === "teacher") base.teacher++
      else base.student++
    }
    return base
  }, [rows])

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? filtered.map((r) => r.institution_user_id) : [])
  }

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  const onChangeRole = async (
    row: InstitutionUser,
    role: "admin" | "teacher" | "student"
  ) => {
    setLoadingRowId(row.institution_user_id)
    try {
      await changeRole.mutateAsync({
        institution_user_id: row.institution_user_id,
        role,
      })
    } finally {
      setLoadingRowId(undefined)
    }
  }

  const askRemove = (row: InstitutionUser) => {
    setToRemove(row)
    setRemoveOpen(true)
  }

  const doRemove = async () => {
    if (!toRemove) return
    setLoadingRowId(toRemove.institution_user_id)
    try {
      await removeUser.mutateAsync(toRemove.institution_user_id)
      setSelected((prev) =>
        prev.filter((x) => x !== toRemove.institution_user_id)
      )
    } finally {
      setLoadingRowId(undefined)
      setRemoveOpen(false)
      setToRemove(null)
    }
  }

  const bulkRole = async (role: "admin" | "teacher" | "student") => {
    for (const id of selected) {
      await changeRole.mutateAsync({ institution_user_id: id, role })
    }
    setSelected([])
  }

  const bulkRemove = async () => {
    for (const id of selected) {
      await removeUser.mutateAsync(id)
    }
    setSelected([])
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PeopleHeaderSkeleton />
        <PeopleTableSkeleton />
      </div>
    )
  }

  if ((rows?.length ?? 0) === 0) {
    return <EmptyState institutionId={institutionId} />
  }

  return (
    <div className="space-y-4">
      <PeopleHeader
        institutionId={institutionId}
        total={rows.length}
        counts={counts}
        onBack={() => router.push(`/institutions/${institutionId}/manage`)}
      />

      <PeopleToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        totalFiltered={filtered.length}
      />

      <PeopleBulkBar
        count={selected.length}
        onBulkRole={bulkRole}
        onBulkRemove={bulkRemove}
        disabled={changeRole.isPending || removeUser.isPending}
      />

      <PeopleTable
        rows={filtered}
        selectedIds={selected}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onChangeRole={onChangeRole}
        onAskRemove={askRemove}
        loadingRowId={loadingRowId}
      />

      <RemoveUserModal
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        memberName={toRemove?.user?.full_name}
        isLoading={removeUser.isPending}
        onConfirm={doRemove}
      />
    </div>
  )
}
