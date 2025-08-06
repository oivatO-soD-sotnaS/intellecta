"use client"

import React, { useState } from "react"
import Image from "next/image"

import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"
import { useInviteUsers } from "@/hooks/institution/useInviteUsers"
import { useChangeUserRole } from "@/hooks/institution/useChangeUserRole"
import { useRemoveInstitutionUser } from "@/hooks/institution/useRemoveInstitutionUser"
import type { InstitutionUserDto } from "../schema/institutionUserSchema"
import { Card, CardBody } from "@heroui/card"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface MembersListProps {
  users: InstitutionUserDto[]
  institutionId: string
}

export default function MembersList({
  users,
  institutionId,
}: MembersListProps) {
  // Mutations
  const invite = useInviteUsers(institutionId)
  const changeRole = useChangeUserRole(institutionId)
  const removeUser = useRemoveInstitutionUser(institutionId)

  const [emailToInvite, setEmailToInvite] = useState("")

  const handleInvite = () => {
    if (!emailToInvite) return
    invite.mutate([emailToInvite], {
      onSuccess: () => setEmailToInvite(""),
    })
  }

  return (
    <div className="space-y-6">
      {/* Form de convite */}
      <Card className="p-4">
        <CardBody className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <Input
            placeholder="Digite o e-mail para convidar"
            value={emailToInvite}
            onChange={(e) => setEmailToInvite(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleInvite}
            disabled={invite.isLoading}
            className="mt-2 sm:mt-0"
          >
            {invite.isLoading ? "Enviando..." : "Convidar usuário"}
          </Button>
        </CardBody>
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
          </Card>
        ))}
      </div>
    </div>
  )
}
