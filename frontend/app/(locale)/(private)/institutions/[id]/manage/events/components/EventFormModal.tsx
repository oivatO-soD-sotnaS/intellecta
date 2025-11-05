// app/(locale)/(private)/institutions/[id]/manage/events/_components/EventFormModal.tsx
"use client"

import * as React from "react"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: {
    id: string
    title: string
    description?: string
    start: Date
    end: Date
    allDay?: boolean
  } | null
  mode: "create" | "edit"
  allowedTypes: string[]
  onSubmit: (payload: {
    title: string
    description?: string
    event_date: string // ISO
    event_type?: string
  }) => Promise<void> | void
}

export default function EventFormModal({
  open,
  onOpenChange,
  initial,
  mode,
  allowedTypes,
  onSubmit,
}: Props) {
  const [title, setTitle] = React.useState(initial?.title ?? "")
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  )
  const [date, setDate] = React.useState<string>(
    initial?.start
      ? toLocalDatetime(initial.start)
      : toLocalDatetime(new Date())
  )
  const [eventType, setEventType] = React.useState<string>("other")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && initial) {
      setTitle(initial.title ?? "")
      setDescription(initial.description ?? "")
      setDate(toLocalDatetime(initial.start ?? new Date()))
      setEventType("other")
    }
  }, [open, initial])

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        event_date: new Date(date).toISOString(),
        event_type: eventType,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          {mode === "create" ? "Novo evento" : "Editar evento"}
        </ModalHeader>
        <ModalBody className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="ev-title">Título</Label>
            <Input
              id="ev-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Reunião do conselho"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-date">Data e hora</Label>
            <Input
              id="ev-date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {date
                ? `Selecionado: ${format(new Date(date), "dd/MM/yyyy HH:mm")}`
                : ""}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-type">Tipo</Label>
            <select
              id="ev-type"
              className="w-full rounded-md border bg-background px-3 py-2"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              {allowedTypes.map((t) => (
                <option key={t} value={t}>
                  {labelFromType(t)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-desc">Descrição</Label>
            <Textarea
              id="ev-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do evento..."
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function toLocalDatetime(d: Date) {
  // YYYY-MM-DDTHH:mm (controlado por input[type=datetime-local])
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function labelFromType(t: string) {
  const map: Record<string, string> = {
    holiday: "Feriado",
    exam: "Prova",
    meeting: "Reunião",
    deadline: "Prazo",
    other: "Outro",
  }
  return map[t] ?? t
}
