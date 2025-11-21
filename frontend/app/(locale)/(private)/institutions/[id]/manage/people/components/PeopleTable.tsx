// app/(locale)/(private)/institutions/[id]/manage/people/_components/PeopleTable.tsx
"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import RoleSelect from "./RoleSelect"
import { Trash2 } from "lucide-react"
import type { InstitutionUser } from "@/hooks/institutions/useInstitutionUsers"
import { Avatar } from "@heroui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

type Props = {
  rows: InstitutionUser[]
  selectedIds: string[]
  onToggleRow: (id: string, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
  onChangeRole: (
    row: InstitutionUser,
    role: "admin" | "teacher" | "student"
  ) => void
  onAskRemove: (row: InstitutionUser) => void
  loadingRowId?: string // para feedback quando alterando papel/removendo
}

export default function PeopleTable({
  rows,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onChangeRole,
  onAskRemove,
  loadingRowId,
}: Props) {
  const allChecked = rows.length > 0 && selectedIds.length === rows.length

  return (
    <Card className="overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-3 py-2 w-[36px]">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(v) => onToggleAll(Boolean(v))}
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="px-3 py-2">Membro</th>
              <th className="px-3 py-2">E-mail</th>
              <th className="px-3 py-2">Papel</th>
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = row.institution_user_id
              const checked = selectedIds.includes(id)
              const avatarProps = row.user?.profile_picture?.url
                ? { src: row.user.profile_picture.url }
                : { name: row.user?.full_name ?? "U" }

              return (
                <tr key={id} className="border-t">
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => onToggleRow(id, Boolean(v))}
                      aria-label={`Selecionar ${row.user?.full_name ?? "usuário"}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="h-8 w-8"
                        radius="full"
                        {...(row.user?.profile_picture?.url
                          ? { src: row.user.profile_picture.url }
                          : { name: row.user?.full_name ?? "U" })}
                      />
                      <div>
                        <div className="font-medium">
                          {row.user?.full_name ?? "Sem nome"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const uid = row.user?.user_id ?? row.user_id ?? ""
                            return uid ? `#${uid.slice(0, 6)}` : "—"
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2 text-sm text-muted-foreground">
                    {row.user?.email ?? "—"}
                  </td>

                  <td className="px-3 py-2">
                    <RoleSelect
                      value={row.role}
                      onChange={(role) => onChangeRole(row, role)}
                      disabled={loadingRowId === id}
                    />
                  </td>

                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onAskRemove(row)}
                      disabled={loadingRowId === id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </td>
                </tr>
              )
            })}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhum membro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
