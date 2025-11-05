// app/(locale)/(private)/institutions/[id]/manage/events/_components/EventDetailsDrawer.tsx
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
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { CalendarEvent } from "@/components/event-calendar"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  event: CalendarEvent | null
  onEdit: () => void
  onDelete: () => void
  contextLabel?: string // "Disciplina" | "Instituição"
}

export default function EventDetailsDrawer({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  contextLabel = "Contexto",
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {event?.title ?? "Evento"}
          </SheetTitle>
          <SheetDescription>
            {event?.start
              ? format(event.start, "dd/MM/yyyy HH:mm")
              : "Sem data definida"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {event?.description ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Sem descrição.</p>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full px-2 py-1 bg-secondary">
              {contextLabel}
            </span>
            {event?.color ? (
              <span className="rounded-full px-2 py-1 bg-secondary/60">
                Cor: {event.color}
              </span>
            ) : null}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="flex w-full justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button variant="outline" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Excluir
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
