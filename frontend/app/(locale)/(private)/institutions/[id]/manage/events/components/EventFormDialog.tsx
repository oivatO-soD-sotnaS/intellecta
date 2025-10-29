"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarEvent } from "@/components/event-calendar"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: CalendarEvent | null
  onSubmit: (evt: Omit<CalendarEvent, "id"> & { id?: string }) => void
}

const TYPES = [
  { value: "reuniao", label: "Reunião" },
  { value: "feriado", label: "Feriado" },
  { value: "prova", label: "Prova/Avaliação" },
  { value: "aviso", label: "Aviso" },
  { value: "outros", label: "Outros" },
]

export default function EventFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState("reuniao")
  const [dateTime, setDateTime] = useState("")
  const [allDay, setAllDay] = useState(false)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "")
      setDescription(initial.description || "")
      const dt = initial.start ? new Date(initial.start) : new Date()
      setDateTime(
        new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      )
      setAllDay(!!initial.allDay)
      // mappar de descrição de tipo -> simples: manter como estava no description ou ignorar
      // aqui não temos event_type explícito no CalendarEvent; manter seleção anterior
    } else {
      const now = new Date()
      setTitle("")
      setDescription("")
      setEventType("reuniao")
      setAllDay(false)
      setDateTime(
        new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      )
    }
  }, [initial])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar evento" : "Novo evento"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do evento (mock).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Data/Hora</Label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <label className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
              Dia inteiro
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="rounded-xl"
            onClick={() => {
              const start = new Date(dateTime)
              const end = allDay
                ? new Date(dateTime)
                : new Date(start.getTime() + 60 * 60 * 1000)
              onSubmit({
                id: initial?.id,
                title,
                description,
                start,
                end,
                allDay,
              })
              onOpenChange(false)
            }}
          >
            Salvar (mock)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
