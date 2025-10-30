"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, UserCog, Shield, Users } from "lucide-react"
import type { InstitutionUser, InstitutionUserRole } from "./types"
import { MOCK_INSTITUTION_USERS } from "./mocks"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"
import { Badge } from "@heroui/badge"
import Back from "../../_components/Back"

const ROLE_LABEL: Record<InstitutionUserRole, string> = {
  admin: "Admin",
  teacher: "Professor",
  student: "Aluno",
}

export default function PeopleManageClient({
  institutionId,
}: {
  institutionId: string
}) {
  const [items, setItems] = useState<InstitutionUser[]>(MOCK_INSTITUTION_USERS)
  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | InstitutionUserRole>(
    "all"
  )

  const [selection, setSelection] = useState<Record<string, boolean>>({})
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false)

  // Filtragem por texto/role
  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim()
    let base = [...items]
    if (roleFilter !== "all") base = base.filter((i) => i.role === roleFilter)
    if (qq) {
      base = base.filter((i) =>
        [i.user.full_name, i.user.email, ROLE_LABEL[i.role]]
          .join(" ")
          .toLowerCase()
          .includes(qq)
      )
    }
    return base
  }, [items, q, roleFilter])

  const allVisibleIds = filtered.map((i) => i.institution_user_id)
  const selectedIds = allVisibleIds.filter((id) => selection[id])
  const allSelected =
    selectedIds.length === allVisibleIds.length && allVisibleIds.length > 0

  const toggleRow = (id: string) =>
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }))
  const toggleAll = () => {
    const next: Record<string, boolean> = {}
    const setVal = !allSelected
    allVisibleIds.forEach((id) => (next[id] = setVal))
    setSelection((prev) => ({ ...prev, ...next }))
  }

  // Alterar papel (inline)
  const changeRole = (
    institution_user_id: string,
    role: InstitutionUserRole
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.institution_user_id === institution_user_id ? { ...i, role } : i
      )
    )
  }

  // Remover (linha)
  const removeOne = (institution_user_id: string) => {
    setItems((prev) =>
      prev.filter((i) => i.institution_user_id !== institution_user_id)
    )
    setSelection((prev) => {
      const copy = { ...prev }
      delete copy[institution_user_id]
      return copy
    })
  }

  // Alterar papel em massa
  const bulkChangeRole = (role: InstitutionUserRole) => {
    setItems((prev) =>
      prev.map((i) => (selection[i.institution_user_id] ? { ...i, role } : i))
    )
  }

  // Remover em massa
  const bulkRemove = () => {
    setItems((prev) => prev.filter((i) => !selection[i.institution_user_id]))
    setSelection({})
    setConfirmBulkOpen(false)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="space-x-4">
        <Back hrefFallback={`/institutions/${institutionId}/manage`} />
      </div>
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Papéis de Usuário
          </CardTitle>
          <CardDescription>
            Remova membros da instituição ou altere seus papéis (aluno,
            professor, admin).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Separator />

          {/* Top controls */}
          <div className="mt-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Buscar por nome, e-mail ou papel…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="max-w-[360px]"
              />
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as any)}
              >
                <SelectTrigger className="w-[200px] rounded-xl">
                  <SelectValue placeholder="Todos os papéis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os papéis</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Professor</SelectItem>
                  <SelectItem value="student">Aluno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ações em massa */}
            <div className="flex gap-2">
              <BulkRoleSelect
                disabled={selectedIds.length === 0}
                onChange={(r) => bulkChangeRole(r)}
              />
              <Button
                variant="ghost"
                className="rounded-xl text-destructive hover:text-destructive"
                disabled={selectedIds.length === 0}
                onClick={() => setConfirmBulkOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover selecionados
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <div className="mt-4 rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Entrou em</TableHead>
                  <TableHead className="text-right w-[1%]">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((i) => {
                  const sel = !!selection[i.institution_user_id]
                  return (
                    <TableRow key={i.institution_user_id} data-selected={sel}>
                      <TableCell>
                        <Checkbox
                          checked={sel}
                          onCheckedChange={() =>
                            toggleRow(i.institution_user_id)
                          }
                          aria-label={`Selecionar ${i.user.full_name}`}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <AppAvatar
                            src={i.user.profile_picture?.url}
                            name={i.user.full_name}
                            size="sm"
                          />
                          <div className="text-sm">
                            <div className="font-medium">
                              {i.user.full_name}
                            </div>
                            <div className="text-muted-foreground">
                              {i.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <RoleInlineSelect
                          value={i.role}
                          onChange={(r) => changeRole(i.institution_user_id, r)}
                        />
                      </TableCell>

                      <TableCell className="text-sm">
                        <Badge variant="flat">
                          {new Date(i.created_at).toLocaleString()}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="rounded-xl text-destructive hover:text-destructive"
                          onClick={() =>
                            setConfirmRemoveId(i.institution_user_id)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-sm text-muted-foreground"
                    >
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Rodapé com contagem */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              {filtered.length} usuário(s) visível(is) ·{" "}
              {Object.values(selection).filter(Boolean).length} selecionado(s)
            </div>
            <Badge variant="flat">Inst: {institutionId}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dialog remover 1 */}
      <Dialog
        open={!!confirmRemoveId}
        onOpenChange={(o) => !o && setConfirmRemoveId(null)}
      >
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Remover usuário da instituição</DialogTitle>
            <DialogDescription>
              Esta ação é mock nesta etapa, mas removerá o usuário da lista.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setConfirmRemoveId(null)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl"
              variant="destructive"
              onClick={() => {
                if (confirmRemoveId) removeOne(confirmRemoveId)
                setConfirmRemoveId(null)
              }}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog remover em massa */}
      <Dialog open={confirmBulkOpen} onOpenChange={setConfirmBulkOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Remover selecionados</DialogTitle>
            <DialogDescription>
              Você está prestes a remover {selectedIds.length} usuário(s) da
              instituição (mock).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setConfirmBulkOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl"
              variant="destructive"
              onClick={bulkRemove}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/** Select inline usado na coluna "Papel" */
function RoleInlineSelect({
  value,
  onChange,
}: {
  value: InstitutionUserRole
  onChange: (role: InstitutionUserRole) => void
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Select
        value={value}
        onValueChange={(v) => onChange(v as InstitutionUserRole)}
      >
        <SelectTrigger className="w-[170px] rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="teacher">Professor</SelectItem>
          <SelectItem value="student">Aluno</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

/** Select de ações em massa para mudar papel de todos selecionados */
function BulkRoleSelect({
  disabled,
  onChange,
}: {
  disabled?: boolean
  onChange: (role: InstitutionUserRole) => void
}) {
  return (
    <Select
      onValueChange={(v) => onChange(v as InstitutionUserRole)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[230px] rounded-xl">
        <SelectValue placeholder="Alterar papel dos selecionados" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">→ Tornar Admin</SelectItem>
        <SelectItem value="teacher">→ Tornar Professor</SelectItem>
        <SelectItem value="student">→ Tornar Aluno</SelectItem>
      </SelectContent>
    </Select>
  )
}
