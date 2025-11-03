"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import TeacherSelect from "./TeacherSelect"
import { useUpdateSubject } from "@/hooks/subjects/useUpdateSubject"
import { useSubject } from "@/hooks/subjects/useSubject"

const schema = z.object({
  name: z.string().min(3, "Mínimo de 3 caracteres"),
  description: z
    .string()
    .max(300, "Máximo de 300 caracteres")
    .optional()
    .or(z.literal("")),
  teacher_id: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  institutionId: string
  subjectId: string
}

export default function SubjectEditSheet({
  open,
  onOpenChange,
  institutionId,
  subjectId,
}: Props) {
  const { data } = useSubject(institutionId, subjectId)
  const updateMutation = useUpdateSubject(institutionId, subjectId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      teacher_id: data?.teacher_id ?? undefined,
    },
  })

  const onSubmit = async (values: FormValues) => {
    await updateMutation.mutateAsync({
      name: values.name,
      description: values.description || undefined,
      teacher_id: values.teacher_id || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Editar disciplina</SheetTitle>
          <SheetDescription>
            Atualize nome, descrição e professor responsável.
          </SheetDescription>
        </SheetHeader>

        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Professor</Label>
            <TeacherSelect
              institutionId={institutionId}
              value={form.watch("teacher_id")}
              onChange={(v) => form.setValue("teacher_id", v)}
              placeholder="Selecione um professor"
            />
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
