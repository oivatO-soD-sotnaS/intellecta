"use client"

import React, { useState } from "react"
import Image from "next/image"

import type { InstitutionUserDto } from "@/types/institution"
import {
  useInviteUsersRaw,
  type Role,
} from "@/hooks/invitations/useInviteUsersRaw"
import { useChangeUserRole } from "@/hooks/institution/useChangeUserRole"
import { useRemoveInstitutionUser } from "@/hooks/institution/useRemoveInstitutionUser"

import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { toast } from "@heroui/theme"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface MembersListProps {
  users: InstitutionUserDto[]
  id: string
  readOnly?: boolean
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export default function MembersList({
  users,
  id,
  readOnly = false,
  isLoading,
  isError,
  onRetry,
}: MembersListProps) {
  // Mutations (só usam quando não readOnly)
  const invite = useInviteUsersRaw(id)
  const changeRole = useChangeUserRole(id)
  const removeUser = useRemoveInstitutionUser(id)

  const [emailToInvite, setEmailToInvite] = useState("")
  const [quickRole, setQuickRole] = useState<Role>("student")

  const handleInvite = () => {
    const email = emailToInvite.trim().toLowerCase()
    if (!email) return

    invite.mutate([{ email, role: quickRole }], {
      onSuccess: () => {
        setEmailToInvite("")
        toast({ title: "Convite enviado" })
      },
      onError: (err: any) => {
        let msg = "Falha ao enviar convite."
        if (err?.data) {
          msg =
            err.data?.message ||
            err.data?.error ||
            (typeof err.data === "string" ? err.data : JSON.stringify(err.data))
        } else if (err?.message) {
          msg = err.message
        }
        if (err?.status === 401) msg = "Sessão expirada. Faça login novamente."
        toast({ title: `[${err?.status ?? 500}] ${msg}` })
      },
    })
  }

  // Estados de carregamento/erro
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between rounded-lg border p-4">
        <span className="text-sm text-muted-foreground">
          Falha ao carregar membros.
        </span>
        {onRetry && (
          <Button size="sm" onPress={onRetry}>
            Tentar novamente
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Form de convite rápido (mostra apenas quando não readOnly) */}
      {!readOnly && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <Input
              placeholder="Digite o e-mail para convidar"
              value={emailToInvite}
              onChange={(e) => setEmailToInvite(e.target.value)}
              className="flex-1"
            />

            <div className="mt-2 sm:mt-0">
              <Select
                value={quickRole}
                onValueChange={(val) => setQuickRole(val as Role)}
              >
                <SelectTrigger className="w-28 text-sm">
                  <SelectValue placeholder={quickRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleInvite}
              disabled={invite.isPending || !emailToInvite.trim()}
              className="mt-2 sm:mt-0"
            >
              {invite.isPending ? "Enviando..." : "Convidar usuário"}
            </Button>
          </div>
        </Card>
      )}

      {/* Lista de usuários */}
      <div className="grid gap-4">
        {users.map((u) => (
          <Card key={u.institutionUserId} className="flex items-center p-4">
            {u.user.profilePictureUrl && (
              <Image
                src={u.user.profilePictureUrl}
                alt={u.user.fullName}
                width={48}
                height={48}
                className="rounded-full mr-4"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{u.user.fullName}</p>
              <p className="text-xs text-gray-500">{u.user.email}</p>
            </div>

            {/* Ações: ocultas em modo read-only */}
            {!readOnly ? (
              <div className="flex items-center space-x-2">
                {/* Seletor de papel */}
                <Select
                  value={u.role}
                  onValueChange={(val) =>
                    changeRole.mutate({
                      userId: u.institutionUserId,
                      newRole: val,
                    })
                  }
                >
                  <SelectTrigger className="w-24 text-sm">
                    <SelectValue placeholder={u.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>

                {/* Botão remover */}
                <Button
                  variant="faded"
                  size="sm"
                  onClick={() => removeUser.mutate(u.institutionUserId)}
                >
                  Remover
                </Button>
              </div>
            ) : (
              // Modo leitura: mostra somente a role
              <span className="rounded-md border px-2 py-1 text-xs">
                {u.role}
              </span>
            )}
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Nenhum membro encontrado.
        </div>
      )}
    </div>
  )
}
