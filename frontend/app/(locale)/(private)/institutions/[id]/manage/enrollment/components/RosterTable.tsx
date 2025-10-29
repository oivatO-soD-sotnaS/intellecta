"use client"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Info, Trash2 } from "lucide-react"
import type { ClassUser } from "./types"
import { Badge } from "@heroui/badge"
import AppAvatar from "@/app/(locale)/(private)/components/AppAvatar"

export default function RosterTable({
  data,
  onRemove,
  onOpen,
}: {
  data: ClassUser[]
  onRemove: (class_users_id: string) => void
  onOpen: (row: ClassUser) => void
}) {
  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground py-10 text-center">
        Nenhum membro nesta turma.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Entrou em</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const initials = row.user.full_name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
            return (
              <TableRow key={row.class_users_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <AppAvatar
                      src={row.user.profile_picture?.url}
                      name={row.user.full_name}
                      size="sm"
                    />

                    <div className="leading-tight">
                      <div className="font-medium">{row.user.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="flat" className="capitalize">
                    {row.role}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(row.joined_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => onOpen(row)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full text-destructive hover:text-destructive"
                    onClick={() => onRemove(row.class_users_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
