"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CalendarPlus,
  CalendarDays,
  CalendarClock,
  Trash2,
  Pencil,
} from "lucide-react"



import type { InstitutionalEvent } from "./types"
import { MOCK_INSTITUTIONAL_EVENTS } from "./mocks"
import { institutionalToCalendar, colorByType } from "./adapters"
import EventFormDialog from "./EventFormDialog"
import Legend from "./Legend"
import { CalendarEvent, EventCalendar } from "@/components/event-calendar"
import { Badge } from "@heroui/badge"

type Scope = "all" | "institutional" | "subjects" // subjects opcional para futuro

export default function EventsClient({
  institutionId,
}: {
  institutionId: string
}) {
  // Mocks (institucional)
  const [rawInstitutional, setRawInstitutional] = useState<
    InstitutionalEvent[]
  >(MOCK_INSTITUTIONAL_EVENTS(institutionId))

  // Filtros
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<
    "all" | "feriado" | "reuniao" | "prova" | "aviso" | "outros"
  >("all")
  const [scope, setScope] = useState<Scope>("all")

  // Dialogs (create/edit)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)

  // Adaptação p/ o calendário
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const base = rawInstitutional.map(institutionalToCalendar) // por enquanto só institucional
    // aqui, se quiser, concatene eventos de "disciplinas" (deadlines) no futuro
    return base
  }, [rawInstitutional])

  // Aplicar filtros no que vai para o calendário
  const filteredEvents = useMemo<CalendarEvent[]>(() => {
    let list = [...calendarEvents]

    // scope: por ora apenas institutional (mas mantemos API pronta)
    if (scope === "institutional") {
      list = list // já é institucional
    } else if (scope === "subjects") {
      list = [] // sem eventos de disciplinas neste momento
    }

    // tipo (precisamos inferir do color -> map simples invertido)
    if (typeFilter !== "all") {
      list = list.filter((e) => colorToType(e.color) === typeFilter)
    }

    // busca: title/description
    const qq = query.trim().toLowerCase()
    if (qq) {
      list = list.filter((e) =>
        [e.title || "", e.description || ""]
          .join(" ")
          .toLowerCase()
          .includes(qq)
      )
    }
    return list
  }, [calendarEvents, scope, typeFilter, query])

  const upcoming = useMemo(() => {
    return [...filteredEvents]
      .sort((a, b) => +new Date(a.start) - +new Date(b.start))
      .slice(0, 8)
  }, [filteredEvents])

  // Helpers (map cor -> tipo simples, coerente com colorByType)
  function colorToType(
    color?: CalendarEvent["color"]
  ): "feriado" | "reuniao" | "prova" | "aviso" | "outros" {
    switch (color) {
      case "violet":
        return "feriado"
      case "sky":
        return "reuniao"
      case "rose":
        return "prova"
      case "amber":
        return "aviso"
      default:
        return "outros"
    }
  }

  // Callbacks exigidos pelo EventCalendar
  const handleEventAdd = (event: CalendarEvent) => {
    // Usuário pode adicionar direto no calendário (se esse recurso existir)
    // Vamos inserir como mock institucional:
    const newRaw: InstitutionalEvent = {
      institutional_event_id: `ie-${Date.now()}`,
      institution_id: institutionId,
      event_id: event.id || `e-${Date.now()}`,
      title: event.title || "Evento",
      description: event.description,
      event_date: new Date(event.start).toISOString(),
      event_type: colorToType(event.color),
    }
    setRawInstitutional((p) => [newRaw, ...p])
  }

  const handleEventUpdate = (updated: CalendarEvent) => {
    // mapeia para nosso raw e atualiza
    setRawInstitutional((prev) =>
      prev.map((r) =>
        r.event_id === updated.id
          ? {
              ...r,
              title: updated.title || r.title,
              description: updated.description,
              event_date: new Date(updated.start).toISOString(),
              event_type: colorToType(updated.color),
            }
          : r
      )
    )
  }

  const handleEventDelete = (eventId: string) => {
    setRawInstitutional((prev) => prev.filter((r) => r.event_id !== eventId))
  }

  // Botão "Novo evento" (abre o form)
  const openCreate = () => {
    setEditing(null)
    setOpenForm(true)
  }

  const submitForm = (data: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (editing) {
      // editar
      const updated: CalendarEvent = {
        id: editing.id,
        ...data,
        color:
          data.color ??
          institutionalToCalendar({
            institutional_event_id: "tmp",
            institution_id: institutionId,
            event_id: editing.id!,
            title: data.title || editing.title,
            description: data.description,
            event_date: new Date(data.start).toISOString(),
            event_type: colorToType(editing.color),
          }).color,
      }
      handleEventUpdate(updated)
    } else {
      // criar
      const id = `e-${Date.now()}`
      const newEvt: CalendarEvent = {
        id,
        ...data,
        color: data.color ?? "sky",
      }
      handleEventAdd(newEvt)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Eventos
          </CardTitle>
          <CardDescription>
            Calendário institucional (mock). Crie, edite e exclua eventos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator />

          {/* Filtros */}
          <div className="mt-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Buscar por título ou descrição…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-[360px]"
              />
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as any)}
              >
                <SelectTrigger className="w-[220px] rounded-xl">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="feriado">Feriado</SelectItem>
                  <SelectItem value="prova">Prova/Avaliação</SelectItem>
                  <SelectItem value="aviso">Aviso</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scope} onValueChange={(v) => setScope(v as Scope)}>
                <SelectTrigger className="w-[220px] rounded-xl">
                  <SelectValue placeholder="Escopo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos (mock)</SelectItem>
                  <SelectItem value="institutional">Institucional</SelectItem>
                  <SelectItem value="subjects" disabled>
                    Disciplinas (em breve)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button className="rounded-xl" onClick={openCreate}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Novo evento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Corpo: calendário + lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <Card className="rounded-2xl">
          <CardContent className="p-2 md:p-4">
            <EventCalendar
              events={filteredEvents}
              onEventAdd={handleEventAdd}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Próximos eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {upcoming.map((e) => (
                  <div key={e.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium">{e.title}</div>
                      <Badge variant="solid">
                        {new Date(e.start).toLocaleString()}
                      </Badge>
                    </div>
                    {e.description ? (
                      <div className="text-xs text-muted-foreground mt-1">
                        {e.description}
                      </div>
                    ) : null}
                    <div className="mt-2 flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          setEditing(e)
                          setOpenForm(true)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-1.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-destructive hover:text-destructive"
                        onClick={() => handleEventDelete(e.id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    Sem eventos no filtro atual.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-200">
                  Feriado
                </Badge>
                <Badge className="bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200">
                  Reunião
                </Badge>
                <Badge className="bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200">
                  Prova
                </Badge>
                <Badge className="bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                  Aviso
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
                  Outros
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de criar/editar */}
      <EventFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        onSubmit={(payload) => {
          // Garante uma cor coerente com "tipo" inferido anteriormente
          const evtType = editing ? colorToType(editing.color) : "reuniao"
          submitForm({
            ...payload,
            color: payload.color ?? colorByType(evtType),
          })
        }}
      />
    </div>
  )
}
