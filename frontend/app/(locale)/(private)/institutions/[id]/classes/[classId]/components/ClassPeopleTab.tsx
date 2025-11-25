"use client"

import React from "react"
import { useClassUsers } from "@/hooks/classes/useClassUsers"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ClassPeopleTabProps = {
  institutionId: string
  classId: string
}

export function ClassPeopleTab({
  institutionId,
  classId,
}: ClassPeopleTabProps) {
  const {
    data: classUsers,
    isLoading,
    error,
  } = useClassUsers(institutionId, classId)

  const total = classUsers?.length ?? 0

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Erro ao carregar participantes da turma:
        <span className="font-semibold"> {error.message}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-tight">
          Pessoas da turma
        </h2>
        <p className="text-xs text-muted-foreground">
          Lista de professores e alunos matriculados nesta turma.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableCaption className="text-xs text-muted-foreground">
            {isLoading
              ? "Carregando participantes..."
              : total === 0
                ? "Nenhuma pessoa cadastrada nesta turma ainda."
                : `${total} ${
                    total === 1 ? "pessoa na turma" : "pessoas na turma"
                  }.`}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Usuário</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="w-[180px]">Entrou em</TableHead>
            </TableRow>
          </TableHeader>



          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  Carregando participantes...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && total === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  Nenhuma pessoa adicionada a esta turma ainda.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              classUsers?.map((item) => {
                const name = item.user?.full_name ?? "Usuário sem nome"
                const email = item.user?.email ?? "E-mail não informado"
                const avatarUrl = item.user?.profile_picture?.url
                const firstLetter = name.charAt(0).toUpperCase()

                const joinedAt = item.joined_at
                  ? new Date(item.joined_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"

                return (
                  <TableRow key={item.class_users_id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={avatarUrl || ""} alt={name} />
                        <AvatarFallback className="text-xs font-semibold">
                          {firstLetter}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">
                          {name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {email}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="align-middle">
                      <span className="text-sm text-muted-foreground break-all">
                        {email}
                      </span>
                    </TableCell>

                    <TableCell className="align-middle">
                      <span className="text-sm text-muted-foreground">
                        {joinedAt}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
