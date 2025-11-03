"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useInstitutionClasses } from "@/hooks/classes/useInstitutionClasses"
import { useClassUsers } from "@/hooks/classes/useClassUsers"
import { useAddUsersToClass } from "@/hooks/classes/useAddUsersToClass"
import { useRemoveClassUser } from "@/hooks/classes/useRemoveClassUser"

import ClassSelect from "./ClassSelect"
import RosterTable from "./RosterTable"
import AddUsersPanel from "./AddUsersPanel"
import UserDetailsSheet from "./UserDetailsSheet"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"

type Props = { institutionId: string }

export default function EnrollmentManageClient({ institutionId }: Props) {
  // Turmas da instituição
  const { data: classes, isLoading: loadingClasses } =
    useInstitutionClasses(institutionId)
  const [classId, setClassId] = useState<string | undefined>(undefined)

  // Usuários da turma selecionada
  const {
    data: classUsers,
    isLoading: loadingClassUsers,
    isFetching: fetchingClassUsers,
  } = useClassUsers(institutionId, classId)

  // Usuários da instituição (para matrículas)
  const { data: instUsers, isLoading: loadingInstUsers } =
    useInstitutionUsers(institutionId)

  // Ações (add/remove)
  const { mutateAsync: addUsers, isPending: adding } = useAddUsersToClass(
    institutionId,
    classId
  )
  const { mutateAsync: removeUser, isPending: removing } = useRemoveClassUser(
    institutionId,
    classId
  )

  // Seleções/estados da UI
  const [selectedForAdd, setSelectedForAdd] = useState<string[]>([])
  const [inspectUserId, setInspectUserId] = useState<string | null>(null)

  // Opções do select de turmas
  const classOptions = useMemo(
    () =>
      (classes ?? []).map((c) => ({
        value: c.class_id,
        label: c.name || c.class_id,
      })),
    [classes]
  )

  // Mapeia usuários disponíveis (instUsers \ classUsers)
  const availableUsers = useMemo(() => {
    if (!instUsers) return []
    const already = new Set((classUsers ?? []).map((r) => r.user_id))
    return instUsers
      .filter((iu) => !already.has(iu.user_id))
      .map((iu) => ({
        user_id: iu.user_id,
        name: iu.user?.full_name || iu.user_id,
        email: iu.user?.email ?? "",
        avatar: iu.user?.profile_picture?.url ?? "",
      }))
  }, [instUsers, classUsers])

  async function handleAdd() {
    if (!classId) return toast.error("Selecione uma turma.")
    if (selectedForAdd.length === 0)
      return toast.error("Selecione ao menos um usuário.")
    try {
      await addUsers(selectedForAdd)
      setSelectedForAdd([])
      toast.success("Usuários adicionados com sucesso.")
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Falha ao adicionar usuários."
      )
    }
  }

  async function handleRemove(class_users_id: string) {
    try {
      await removeUser(class_users_id)
      toast.success("Usuário removido da turma.")
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Falha ao remover usuário."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header + seletor de turma */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Matrículas</h1>
          <p className="text-sm text-muted-foreground">
            Adicione usuários da instituição às turmas e gerencie a lista.
          </p>
        </div>

        <ClassSelect
          loading={loadingClasses}
          options={classOptions}
          value={classId ?? ""}
          onChange={(val) => setClassId(val || undefined)}
        />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Lista da turma */}
        <div className="xl:col-span-2 rounded-xl border border-border/60 bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">
              {classId ? "Usuários da turma" : "Selecione uma turma"}
            </h2>
            {fetchingClassUsers && (
              <span className="text-xs text-muted-foreground">
                Atualizando…
              </span>
            )}
          </div>

          <RosterTable
            loading={loadingClassUsers}
            rows={classUsers ?? []}
            onRemove={handleRemove}
            removing={removing}
            onInspect={(userId) => setInspectUserId(userId)}
          />
        </div>

        {/* Painel de adicionar usuários */}
        <AddUsersPanel
          disabled={!classId}
          loading={loadingInstUsers}
          users={availableUsers}
          selected={selectedForAdd}
          onToggle={(id, checked) =>
            setSelectedForAdd((prev) =>
              checked ? [...prev, id] : prev.filter((x) => x !== id)
            )
          }
          onAdd={handleAdd}
          adding={adding}
        />
      </div>

      {/* Sheet com detalhes do usuário (clique em uma linha) */}
      <UserDetailsSheet
        open={!!inspectUserId}
        onOpenChange={(o) => !o && setInspectUserId(null)}
        user={
          inspectUserId
            ? (classUsers?.find((r) => r.user_id === inspectUserId)?.user ??
              null)
            : null
        }
      />
    </div>
  )
}
