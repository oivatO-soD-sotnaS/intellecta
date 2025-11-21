"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { format, isBefore, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"

import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react"
import { DefaultEndHour, DefaultStartHour, EndHour, StartHour } from "@/components/event-calendar/constants"

import {
  Button
} from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarEvent } from "./types"

// ------------------------------------
// ZOD Schema
// ------------------------------------

const formSchema = z.object({
  title: z.string().min(5, "Mínimo de 5 caracteres").max(64, "Máximo de 64 caracteres"),
  description: z.string().max(256, "Máximo de 256 caracteres").optional(),

  startDate: z.date().refine(isFuture, "A data de início deve ser no futuro"),
  endDate: z.date().refine(isFuture, "A data de fim deve ser no futuro"),

  startHour: z.string(),
  endHour: z.string(),

  type: z.string(),
}).refine((data) => {
  const [h1, m1] = data.startHour.split(":").map(Number)
  const [h2, m2] = data.endHour.split(":").map(Number)

  const start = new Date(data.startDate)
  start.setHours(h1, m1)

  const end = new Date(data.endDate)
  end.setHours(h2, m2)

  return !isBefore(end, start)
}, {
  message: "A data de fim não pode ser anterior à data de início",
  path: ["endDate"],
})

// ------------------------------------
function formatLocalDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  const second = "00"

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

interface EventDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function EventDialog({ event, isOpen, onClose, onSave, onDelete }: EventDialogProps) {
  const [openStartDate, setOpenStartDate] = useState(false)
  const [openEndDate, setOpenEndDate] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "other",
      startDate: new Date(),
      endDate: new Date(),
      startHour: `${DefaultStartHour}:00`,
      endHour: `${DefaultEndHour}:00`,
    },
  })

  // Ao abrir o modal, carregamos os valores do evento
  useEffect(() => {
    if (event) {
      const start = new Date(event.event.event_start)
      const end = new Date(event.event.event_end)

      form.reset({
        title: event.event.title || "",
        description: event.event.description || "",
        type: event.event.type || "other",
        startDate: start,
        endDate: end,
        startHour: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
        endHour: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
      })
    } else {
      form.reset()
    }
  }, [event])

  const opcoesHora = Array.from({ length: (EndHour - StartHour + 1) * 4 }, (_, i) => {
    const hour = StartHour + Math.floor(i / 4)
    const minute = (i % 4) * 15
    const h = hour.toString().padStart(2, "0")
    const m = minute.toString().padStart(2, "0")
    return {
      value: `${h}:${m}`,
      label: `${h}h${m}`,
    }
  })

  const tiposEvento = [
    "exam", "quiz", "assignment", "lecture", "workshop",
    "seminar", "presentation", "deadline", "holiday",
    "announcement", "cultural", "sports", "other"
  ]

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const start = new Date(values.startDate)
    const end = new Date(values.endDate)

    const [h1, m1] = values.startHour.split(":").map(Number)
    const [h2, m2] = values.endHour.split(":").map(Number)

    start.setHours(h1, m1, 0)
    end.setHours(h2, m2, 0)

    onSave({
      generic_id: event?.generic_id || "",
      generic_event_id: event?.generic_event_id || "",
      event: {
        ...event?.event,
        title: values.title,
        description: values.description || "",
        type: values.type,
        event_start: formatLocalDateTime(start),
        event_end: formatLocalDateTime(end),
        changed_at: event?.event.changed_at || "",
        created_at: event?.event.created_at || "",
        event_id: event?.event.event_id || ""
      },
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {event ? "Editar Evento" : "Criar Evento"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Modal de criação/edição de evento
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* TÍTULO */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIÇÃO */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Descrição do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TIPO */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Evento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposEvento.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data início + hora */}
            <div className="flex gap-4">
              <FormField
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover open={openStartDate} onOpenChange={setOpenStartDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {field.value
                              ? format(field.value, "PPP", { locale: ptBR })
                              : "Selecione"}
                            <RiCalendarLine size={16} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date)
                              setOpenStartDate(false)
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="startHour"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hora</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {opcoesHora.map(h => (
                          <SelectItem key={h.value} value={h.value}>
                            {h.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data fim + hora */}
            <div className="flex gap-4">
              <FormField
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data de Fim</FormLabel>
                    <Popover open={openEndDate} onOpenChange={setOpenEndDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-between">
                            {field.value
                              ? format(field.value, "PPP", { locale: ptBR })
                              : "Selecione"}
                            <RiCalendarLine size={16} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date)
                              setOpenEndDate(false)
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="endHour"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hora</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {opcoesHora.map(h => (
                          <SelectItem key={h.value} value={h.value}>
                            {h.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rodapé */}
            <DialogFooter className="flex-row sm:justify-between">
              {event?.generic_id && (
                <Button
                  variant="outline"
                  type="button"
                  size="icon"
                  onClick={() => {
                    onDelete(event.generic_event_id!)
                    onClose()
                  }}
                >
                  <RiDeleteBinLine size={16} />
                </Button>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
