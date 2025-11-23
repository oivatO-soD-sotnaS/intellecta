"use client"

import * as React from "react"
import { CalendarEvent, EventCalendar } from "@/components/event-calendar"
import { useQuery } from "@tanstack/react-query"
import { useDeleteInstitutionalEventById } from "../../_query-options/use-delete-institutional-event-by-id"
import { useCreateInstitutionalEvent } from "../../_query-options/use-create-institutional-event"
import { useUpdateInstitutionalEvent } from "../../_query-options/use-update-institutional-event"
import { toast } from "sonner"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Spinner } from "@heroui/spinner"
import { Alert } from "@heroui/alert"
import { Calendar } from "lucide-react"
import { useInstitution } from "../../layout"

type ApiEvent = {
  event_id: string
  title: string
  description: string
  type: string
  event_start: string
  event_end: string
  created_at: string
  changed_at: string
}

type InstitutionalEvent = {
  institutional_event_id: string
  institution_id: string
  event: ApiEvent
}
type InstitutionalEventsApi = InstitutionalEvent[]

type Props = {
  institutionId: string
}

export default function CalendarWidget({ institutionId }: Props) {
  const { me } = useInstitution()
  
  const createInstitutionalEvent = useCreateInstitutionalEvent(institutionId)
  const deleteInstitutionalEvent = useDeleteInstitutionalEventById(institutionId)
  const updateInstitutionalEvent = useUpdateInstitutionalEvent(institutionId)
  
  const {
    data: events,
    isPending,
    error,
    isError
  } = useQuery({
    queryKey: ["institutional", institutionId, "events"],
    queryFn: async (): Promise<InstitutionalEventsApi> => {
      const response = await fetch(`/api/institutions/${institutionId}/events`)
      if (!response.ok) {
        throw new Error("Falha ao carregar eventos")
      }
      return await response.json()
    },
    select: (data) => {
      return data.map(d => {
        const calendarEvent: CalendarEvent = {
          generic_id: d.institution_id,
          generic_event_id: d.institutional_event_id,
          event: d.event
        }
        return calendarEvent
      })
    }
  })

  const handleEventAdd = (event: CalendarEvent) => {
    createInstitutionalEvent.mutate(event, {
      onSuccess: () => {
        toast.success("Evento criado com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao criar evento. Tente novamente.")
      }
    })
  }

  const handleEventUpdate = (event: CalendarEvent) => {
    updateInstitutionalEvent.mutate(event, {
      onSuccess: () => {
        toast.success("Evento atualizado com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao atualizar evento. Tente novamente.")
      }
    })
  }

  const handleEventDelete = (eventId: string) => {
    deleteInstitutionalEvent.mutate(eventId, {
      onSuccess: () => {
        toast.success("Evento excluído com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao excluir evento. Tente novamente.")
      }
    })
  }

  return (
    <div className="">
      {/* Calendário em tamanho completo */}
      <div className="max-w-full mx-auto">
        <Card className="shadow-lg border-0 h-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Calendário Institucional</h2>
                  <p className="text-gray-500 text-sm">
                    {events && events.length > 0 
                      ? `${events.length} evento(s) agendado(s)` 
                      : "Nenhum evento agendado"
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
                    
          <CardBody className="">
            {/* Estados de Loading e Erro */}
            {isPending && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Spinner size="lg" color="primary" className="mb-4" />
                  <p className="text-gray-600">Carregando seus eventos...</p>
                </div>
              </div>
            )}

            {isError && (
              <div className="p-6">
                <Alert
                  variant="flat" 
                  color="danger" 
                  title="Erro ao carregar eventos"
                  description={error?.message || "Ocorreu um erro ao carregar seus eventos. Tente recarregar a página."}
                />
              </div>
            )}

            {/* Calendário em tamanho completo */}
            {!isPending && !isError && (
              <div className="h-full min-h-[600px]">
                <EventCalendar
                  events={events || []}
                  onEventAdd={handleEventAdd}
                  onEventUpdate={handleEventUpdate}
                  onEventDelete={handleEventDelete}
                  canMutate={me.role === "admin"}
                />
              </div>
            )}

            {/* Estado Vazio */}
            {!isPending && !isError && (!events || events.length === 0) && (
              <div className="text-center py-12">
                <Calendar size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Comece adicionando seu primeiro evento clicando em "novo evento".
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}