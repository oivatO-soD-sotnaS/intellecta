// components/UpcomingEvents.tsx
"use client"

import React from "react"
import Link from "next/link"
import {
  AlertCircle,
  Calendar,
  FileText,
  HelpCircle,
  Megaphone,
  Palette,
  Dumbbell,
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  Presentation,
  Building,
  BookMarked,
  ArrowRight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Event {
  event_id: string
  title: string
  description: string
  type: string
  event_start: string
  event_end: string
  created_at: string
  changed_at: string
  user_event_id: string
  user_id: string
  event_source: string
  institution_id: string | null
  institution_name: string | null
  subject_id: string | null
  subject_name: string | null
  subject_code: string | null
}

interface UpcomingEventsProps {}

// Função para obter ícone e estilos baseado no tipo de evento
const getEventConfig = (type: string) => {
  switch (type) {
    case "exam":
      return { icon: FileText, variant: "destructive" as const, label: "Prova" }
    case "quiz":
      return {
        icon: HelpCircle,
        variant: "destructive" as const,
        label: "Quiz",
      }
    case "assignment":
      return { icon: BookOpen, variant: "default" as const, label: "Trabalho" }
    case "lecture":
      return {
        icon: GraduationCap,
        variant: "secondary" as const,
        label: "Aula",
      }
    case "workshop":
      return { icon: Users, variant: "default" as const, label: "Workshop" }
    case "seminar":
      return {
        icon: Presentation,
        variant: "default" as const,
        label: "Seminário",
      }
    case "presentation":
      return {
        icon: Presentation,
        variant: "default" as const,
        label: "Apresentação",
      }
    case "deadline":
      return { icon: Clock, variant: "destructive" as const, label: "Prazo" }
    case "holiday":
      return { icon: Calendar, variant: "default" as const, label: "Feriado" }
    case "announcement":
      return { icon: Megaphone, variant: "default" as const, label: "Anúncio" }
    case "cultural":
      return { icon: Palette, variant: "default" as const, label: "Cultural" }
    case "sports":
      return { icon: Dumbbell, variant: "default" as const, label: "Esportes" }
    default:
      return { icon: Calendar, variant: "outline" as const, label: "Outro" }
  }
}

// Origem do evento
const getEventSourceConfig = (event: Event) => {
  switch (event.event_source) {
    case "institution":
      return {
        icon: Building,
        label: event.institution_name || "Instituição",
        variant: "secondary" as const,
      }
    case "subject":
      return {
        icon: BookMarked,
        label: event.subject_name || "Disciplina",
        variant: "default" as const,
      }
    case "user":
    default:
      return {
        icon: Users,
        label: "Pessoal",
        variant: "outline" as const,
      }
  }
}

// Componente de evento individual
const EventItem = ({ event }: { event: Event }) => {
  const start = new Date(event.event_start)
  const end = new Date(event.event_end)

  const day = start.getDate().toString().padStart(2, "0")
  const month = start
    .toLocaleString("pt-BR", { month: "short" })
    .toUpperCase()
    .replace(".", "")

  const eventConfig = getEventConfig(event.type)
  const sourceConfig = getEventSourceConfig(event)

  const EventIcon = eventConfig.icon
  const SourceIcon = sourceConfig.icon

  const isToday = new Date().toDateString() === start.toDateString()
  const isTomorrow =
    new Date(Date.now() + 86400000).toDateString() === start.toDateString()

  return (
    <div className="group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
      {/* Data */}
      <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-2 min-w-12">
        <span className="text-xs font-medium text-muted-foreground">
          {month} / {start.getFullYear()}
        </span>
        <span className="text-lg font-bold">{day}</span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h4 className="font-semibold leading-none text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </h4>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {event.description}
              </p>
            )}
          </div>
          <EventIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tipo do evento */}
          <Badge className="text-xs" variant={eventConfig.variant}>
            {eventConfig.label}
          </Badge>

          {/* Origem */}
          <Badge className="text-xs" variant={sourceConfig.variant}>
            <SourceIcon className="h-3 w-3 mr-1" />
            {sourceConfig.label}
          </Badge>

          {/* Instituição do evento de disciplina */}
          {event.event_source === "subject" && event.institution_name && (
            <Badge className="text-xs" variant="outline">
              <Building className="h-3 w-3 mr-1" />
              {event.institution_name}
            </Badge>
          )}

          {/* Indicadores de proximidade */}
          {isToday && (
            <Badge className="text-xs" variant="destructive">
              Hoje
            </Badge>
          )}
          {isTomorrow && (
            <Badge className="text-xs" variant="destructive">
              Amanhã
            </Badge>
          )}
        </div>

        {/* Horário (agora com intervalo) */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {start.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          –{" "}
          {end.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}

// Skeleton para loading
const EventSkeleton = () => (
  <div className="flex items-start gap-4 rounded-lg p-3">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
      <Skeleton className="h-3 w-12" />
    </div>
  </div>
)

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({}) => {
  const {
    data: eventsData,
    isPending,
    error,
  } = useQuery<Event[]>({
    queryKey: ["upcomingEvents"],
    queryFn: () => fetch("/api/me/events/upcoming").then((r) => r.json()),
  })

  // Garantir que events seja sempre um array
  const events = Array.isArray(eventsData) ? eventsData : []

  // Loading
  if (isPending) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <EventSkeleton key={index} />
          ))}
        </CardContent>
      </Card>
    )
  }

  // Error
  if (error) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar os eventos. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Empty
  if (events.length === 0) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Nenhum evento próximo
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Você não tem eventos programados para os próximos dias.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos os eventos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Próximos Eventos
          <Badge className="ml-2" variant="secondary">
            {events.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-scroll">
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <EventItem key={event.user_event_id} event={event} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t w-full">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Ver todos os eventos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
