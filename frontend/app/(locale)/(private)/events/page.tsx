"use client"

import { CalendarEvent, EventCalendar } from "@/components/event-calendar"
import { useQuery } from "@tanstack/react-query"
import { useDeleteUserEventById } from "./_query-options/use-delete-user-event-by-id"
import { useCreateUserEvent } from "./_query-options/use-create-user-event"
import { useUpdateUserEvent } from "./_query-options/use-update-user-event"
import { Calendar } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Spinner } from "@heroui/spinner"
import { Card, CardBody, CardHeader } from "@heroui/card"
import {Alert} from "@heroui/alert";
import { Divider } from "@heroui/divider"

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

type UserEventItem = {
  user_event_id: string
  user_id: string
  event: ApiEvent
}

type UserEventsApi = UserEventItem[]

export default function CalendarPage() {
  const deleteUserEvent = useDeleteUserEventById()
  const createUserEvent = useCreateUserEvent()
  const updateUserEvent = useUpdateUserEvent()

  const {
    data: events,
    isPending,
    error,
    isError
  } = useQuery({
    queryKey: ["user", "events"],
    queryFn: async (): Promise<UserEventsApi> => {
      const response = await fetch("/api/me/events")
      if (!response.ok) {
        throw new Error("Falha ao carregar eventos")
      }
      return await response.json()
    },
    select: (data) => {
      return data.map(d => {
        const calendarEvent: CalendarEvent = {
          generic_id: d.user_id,
          generic_event_id: d.user_event_id,
          event: d.event
        }
        return calendarEvent
      })
    }
  })

  const handleEventAdd = (event: CalendarEvent) => {
    createUserEvent.mutate(event, {
      onSuccess: () => {
        toast.success("Evento criado com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao criar evento. Tente novamente.")
      }
    })
  }

  const handleEventUpdate = (event: CalendarEvent) => {
    updateUserEvent.mutate(event, {
      onSuccess: () => {
        toast.success("Evento atualizado com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao atualizar evento. Tente novamente.")
      }
    })
  }

  const handleEventDelete = (eventId: string) => {
    deleteUserEvent.mutate(eventId, {
      onSuccess: () => {
        toast.success("Evento excluído com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao excluir evento. Tente novamente.")
      }
    })
  }

  // Estados de loading para operações
  const isProcessing = 
    createUserEvent.isPending || 
    updateUserEvent.isPending || 
    deleteUserEvent.isPending

  return (
    <div className="min-h-screen bg-secondary p-6">
      {/* Calendário em tamanho completo */}
      <div className="max-w-full mx-auto">
        <Card className="shadow-lg border-0 h-full">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Meu Calendário</h2>
                  <p className="text-gray-600 mt-1">
                    Gerencie seus eventos e compromissos
                  </p>
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
                />
              </div>
            )}

            {/* Estado Vazio */}
            {!isPending && !isError && (!events || events.length === 0) && (
              <div className="text-center py-12">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Comece adicionando seu primeiro evento clicando em qualquer data no calendário.
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}