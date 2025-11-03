// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/ClassesSubjectsClient.tsx
"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/apiClient"
import { toast } from "sonner"
import ClassesHeader from "./ClassesHeader"
import ClassesTable from "./ClassesTable"
import ClassesToolbar from "./ClassesToolbar"
import ClassCreateDialog from "./ClassCreateDialog"
import ClassEditSheet from "./ClassEditSheet"
import ClassDeleteDialog from "./ClassDeleteDialog"
import debounce from "lodash.debounce"

export type ClassDTO = {
  class_id: string
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
  code?: string | null
  // adicione campos extras conforme seu backend
}

type Props = {
  institutionId: string
}

export default function ClassesSubjectsClient({ institutionId }: Props) {
  const router = useRouter()
  const qc = useQueryClient()

  // ----------------------
  // Estado local da página
  // ----------------------
  const [q, setQ] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // ----------------------
  // Data Fetch (Classes)
  // ----------------------
  const classesQuery = useQuery({
    queryKey: ["institution-classes", institutionId],
    queryFn: () =>
      apiGet<ClassDTO[]>(`/api/institutions/${institutionId}/classes`),
    staleTime: 30_000,
  })

  const filteredData = useMemo(() => {
    const list = classesQuery.data ?? []
    if (!q.trim()) return list
    const term = q.toLowerCase()
    return list.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.class_id?.toLowerCase().includes(term) ||
        c.code?.toLowerCase().includes(term)
    )
  }, [classesQuery.data, q])

  // ----------------------
  // Mutations
  // ----------------------
  const createMutation = useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      apiPost(`/api/institutions/${institutionId}/classes`, payload),
    onSuccess: () => {
      toast.success("Turma criada com sucesso.")
      qc.invalidateQueries({ queryKey: ["institution-classes", institutionId] })
      setCreateOpen(false)
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Erro ao criar turma.")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (p: { class_id: string; data: Partial<ClassDTO> }) =>
      apiPut(
        `/api/institutions/${institutionId}/classes/${p.class_id}`,
        p.data
      ),
    onSuccess: (_, p) => {
      toast.success("Turma atualizada.")
      qc.invalidateQueries({ queryKey: ["institution-classes", institutionId] })
      qc.invalidateQueries({
        queryKey: ["class", institutionId, p.class_id],
      })
      setEditId(null)
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Erro ao atualizar turma.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (class_id: string) =>
      apiDelete(`/api/institutions/${institutionId}/classes/${class_id}`),
    onSuccess: () => {
      toast.success("Turma removida.")
      qc.invalidateQueries({ queryKey: ["institution-classes", institutionId] })
      setDeleteId(null)
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Erro ao remover turma.")
    },
  })

  // ----------------------
  // Actions
  // ----------------------
  const onCreate = (data: { name: string; description?: string }) =>
    createMutation.mutate(data)

  const onEditOpen = (id: string) => setEditId(id)
  const onEditClose = () => setEditId(null)

  const onEditSave = (class_id: string, data: Partial<ClassDTO>) =>
    updateMutation.mutate({ class_id, data })

  const onDeleteOpen = (id: string) => setDeleteId(id)
  const onDeleteClose = () => setDeleteId(null)
  const onDeleteConfirm = () => deleteId && deleteMutation.mutate(deleteId)

  const debouncedSetQ = useMemo(() => debounce((v: string) => setQ(v), 250), [])

  const onOpenSubjects = (cls: ClassDTO) => {
    const href = `/institutions/${institutionId}/manage/classes-subjects?classId=${cls.class_id}#subjects`
    router.prefetch(href)
    router.push(href)
  }

  // Dados para edição (carregados do cache para evitar outro GET)
  const editingClass = useMemo(
    () => classesQuery.data?.find((c) => c.class_id === editId) ?? null,
    [editId, classesQuery.data]
  )

  return (
    <div className="space-y-6">
      <ClassesHeader
        total={classesQuery.data?.length ?? 0}
        institutionId={institutionId}
      />

      <ClassesToolbar
        onSearchChange={(v) => debouncedSetQ(v)}
        onCreateClick={() => setCreateOpen(true)}
        loading={classesQuery.isLoading}
      />

      <ClassesTable
        data={filteredData}
        isLoading={classesQuery.isLoading}
        onOpenSubjects={onOpenSubjects}
        onEdit={onEditOpen}
        onDelete={onDeleteOpen}
      />

      {/* Create */}
      <ClassCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={onCreate}
        submitting={createMutation.isPending}
      />

      {/* Edit */}
      <ClassEditSheet
        open={!!editId}
        onOpenChange={(o) => (o ? null : onEditClose())}
        data={editingClass ?? undefined}
        onSubmit={(payload) =>
          editId ? onEditSave(editId, payload) : undefined
        }
        submitting={updateMutation.isPending}
      />

      {/* Delete */}
      <ClassDeleteDialog
        open={!!deleteId}
        onOpenChange={(o) => (o ? null : onDeleteClose())}
        name={
          classesQuery.data?.find((c) => c.class_id === deleteId)?.name ?? ""
        }
        onConfirm={onDeleteConfirm}
        submitting={deleteMutation.isPending}
      />
    </div>
  )
}
