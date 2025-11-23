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
import { useInstitution } from "../../layout"
import { PeopleHeaderSkeleton, PeopleTableSkeleton } from "./components/Skeletons"
import EmptyState from "./components/EmptyState"
import PeopleHeader from "./components/PeopleHeader"
import PeopleToolbar from "./components/PeopleToolbar"
import PeopleBulkBar from "./components/PeopleBulkBar"
import PeopleTable from "./components/PeopleTable"
import RemoveUserModal from "./components/RemoveUserModal"
import InviteForm from "./components/invite-form"

type RoleFilter = "all" | "admin" | "teacher" | "student"

export default function PeopleManageClient() {
  const { institution } = useInstitution()

  const router = useRouter()
  const { data, isLoading, refetch } = useInstitutionUsers(institution.institution_id)
  const changeRole = useChangeInstitutionUserRole(institution.institution_id)
  const removeUser = useRemoveInstitutionUser(institution.institution_id)

  // UI state
  const [search, setSearch] = React.useState("")
  const [role, setRole] = React.useState<RoleFilter>("all")
  const [selected, setSelected] = React.useState<string[]>([])
  const [removeOpen, setRemoveOpen] = React.useState(false)
  const [toRemove, setToRemove] = React.useState<InstitutionUser | null>(null)
  const [loadingRowId, setLoadingRowId] = React.useState<string | undefined>(
    undefined
  )
  const [showInviteForm, setShowInviteForm] = React.useState(false)

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

  const handleInviteSuccess = () => {
    setShowInviteForm(false)
    // Recarregar a lista de usuários após convite bem-sucedido
    refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PeopleHeaderSkeleton />
        <PeopleTableSkeleton />
      </div>
    )
  }

  if ((rows?.length ?? 0) === 0 && !showInviteForm) {
    return (
      <EmptyState 
        institutionId={institution.institution_id}
        onInviteClick={() => setShowInviteForm(true)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PeopleHeader
        institutionId={institution.institution_id}
        total={rows.length}
        counts={counts}
        onInviteClick={() => setShowInviteForm(!showInviteForm)}
        showInviteForm={showInviteForm}
        
      />

      {showInviteForm && (
        <div className="bg-secondary rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Convidar Pessoas</h3>
          <InviteForm
            institutionId={institution.institution_id}
            onSuccess={handleInviteSuccess}
            onCancel={() => setShowInviteForm(false)}
          />
        </div>
      )}

      {!showInviteForm && (
        <>
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
        </>
      )}
    </div>
  )
}