// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/ClassesTable.tsx
"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ExternalLink, BookOpen, Pencil, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ClassDTO } from "./ClassesSubjectsClient"

type Props = {
  data: ClassDTO[]
  isLoading?: boolean
  onOpenSubjects: (cls: ClassDTO) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function ClassesTable({
  data,
  isLoading,
  onOpenSubjects,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!data?.length) {
    return (
      <Table>
        <TableCaption>Nenhuma turma encontrada.</TableCaption>
      </Table>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="hidden md:table-cell">Código</TableHead>
            <TableHead className="hidden md:table-cell">Criada em</TableHead>
            <TableHead className="w-[1%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cls) => (
            <TableRow key={cls.class_id} className="group">
              <TableCell className="font-medium">{cls.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {cls.description ?? "—"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {cls.code ?? "—"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {cls.created_at
                  ? new Date(cls.created_at).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="data-[state=open]:bg-accent"
                      aria-label="Ações"
                    >
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => onOpenSubjects(cls)}
                      className="cursor-pointer"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Abrir disciplinas
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(cls.class_id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(cls.class_id)}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `/institutions/${/* institutionId not needed for external nav */ ""}`,
                          "_blank"
                        )
                      }
                      disabled
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      (Opcional) Abrir em nova aba
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
