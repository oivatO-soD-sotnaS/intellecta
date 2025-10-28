// app/(locale)/(private)/institutions/[id]/manage/people/components/InvitesTable.tsx
"use client"

import Image from "next/image"
import { MoreHorizontal, Copy, Mail, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Invitation } from "./types"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@heroui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = {
  data: Invitation[]
  onOpen: (row: Invitation) => void
  onResend: (id: string) => void
  onCopy: (id: string) => void
  onRevoke: (id: string) => void
}

export default function InvitesTable({
  data,
  onOpen,
  onResend,
  onCopy,
  onRevoke,
}: Props) {
  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground py-10 text-center">
        Nenhum convite encontrado para este filtro.
      </div>
    )
  }

  const now = new Date()

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-mail</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criação</TableHead>
            <TableHead>Expira</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const accepted = !!row.accepted_at
            const expired = new Date(row.expires_at) <= now
            const status = accepted
              ? "Aceito"
              : expired
                ? "Expirado"
                : "Pendente"
            const statusTone = accepted
              ? "default"
              : expired
                ? "destructive"
                : "secondary"

            return (
              <TableRow
                key={row.invitation_id}
                className="hover:bg-accent/40 cursor-pointer"
                onClick={() => onOpen(row)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {row.invited_by_user?.profile_picture?.url ? (
                      <Image
                        src={row.invited_by_user.profile_picture.url}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full"
                        unoptimized
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-muted" />
                    )}
                    <div className="leading-tight">
                      <div className="font-medium">{row.email}</div>
                      <div className="text-xs text-muted-foreground">
                        por {row.invited_by_user?.full_name ?? "—"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="flat">{row.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusTone as any}>{status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(row.created_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(row.expires_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onCopy(row.invitation_id)}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copiar link
                      </DropdownMenuItem>
                      {!accepted && !expired && (
                        <DropdownMenuItem
                          onClick={() => onResend(row.invitation_id)}
                        >
                          <Mail className="h-4 w-4 mr-2" /> Reenviar e-mail
                        </DropdownMenuItem>
                      )}
                      {!accepted && (
                        <DropdownMenuItem
                          onClick={() => onRevoke(row.invitation_id)}
                          className="text-destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Revogar convite
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
