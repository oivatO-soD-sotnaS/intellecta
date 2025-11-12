"use client"

import React, { useState } from "react"
import Image from "next/image"

import { useChangeUserRole } from "@/hooks/institution/useChangeUserRole"
import { useRemoveInstitutionUser } from "@/hooks/institution/useRemoveInstitutionUser"
import {
  useInviteUsersRaw,
  type Role,
} from "@/hooks/invitations/useInviteUsersRaw"

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
import { Card, CardContent } from "@/components/ui/card"
import { InstitutionUserDto } from "@/types/institution"

interface MembersListProps {
  users: InstitutionUserDto[]
  id: string
}

export default function MembersList({ users, id }: MembersListProps) {
  // Mutations
  const invite = useInviteUsersRaw(id) // ← padronizado para JSON + {email, role}
  const changeRole = useChangeUserRole(id)
  const removeUser = useRemoveInstitutionUser(id)

  // Form de convite rápido
  const [emailToInvite, setEmailToInvite] = useState("")
  const [quickRole, setQuickRole] = useState<Role>("student") // ← papel padrão

  const handleInvite = () => {
    const email = emailToInvite.trim().toLowerCase()
    if (!email) return

    invite.mutate([{ email, role: quickRole }], {
      onSuccess: (created) => {
        setEmailToInvite("")
        toast({ title: `Convite enviado (${created.length})` })
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

  return (
    <div className="space-y-6">
      {/* Form de convite */}
      <Card className="p-4">
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Input
            placeholder="Digite o e-mail para convidar"
            value={emailToInvite}
            onChange={(e) => setEmailToInvite(e.target.value)}
            className="flex-1"
          />

          {/* NOVO: seletor de papel do convite rápido */}
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
        </CardContent>
      </Card>

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

            <div className="flex items-center space-x-2">
              {/* Seletor de papel do membro */}
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
          </Card>
        ))}
      </div>
    </div>
  )
}
