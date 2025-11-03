// app/(locale)/(private)/institutions/[id]/manage/classes-subjects/components/ClassEditSheet.tsx
"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ClassDTO } from "./ClassesSubjectsClient"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: ClassDTO 
  onSubmit: (payload: Partial<ClassDTO>) => void
  submitting?: boolean
}

export default function ClassEditSheet({
  open,
  onOpenChange,
  data,
  onSubmit,
  submitting,
}: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open && data) {
      setName(data.name ?? "")
      setDescription(data.description ?? "")
    }
  }, [open, data])

  const canSave = name.trim().length >= 3

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar turma</SheetTitle>
          <SheetDescription>
            Atualize as informações principais da turma.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 3 caracteres. Máximo 80.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={4}
            />
          </div>

          <div className="grid gap-1 text-xs text-muted-foreground">
            <span>
              Criada em:{" "}
              {data?.created_at
                ? new Date(data.created_at).toLocaleString()
                : "—"}
            </span>
            <span>
              Atualizada em:{" "}
              {data?.updated_at
                ? new Date(data.updated_at).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
              })
            }
            disabled={!canSave || submitting}
          >
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
