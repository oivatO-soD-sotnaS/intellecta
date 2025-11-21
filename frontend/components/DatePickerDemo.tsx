"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

interface DateTimePickerProps {
  value?: string | null
  onChange?: (value: string | null) => void
  minDate?: Date
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
}: DateTimePickerProps) {
  const today = useMemo(() => minDate ?? new Date(), [minDate])

  const [date, setDate] = useState<Date | undefined>(today)
  const [time, setTime] = useState<string | undefined>(undefined)

  const allTimeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "23:59"
  ]

  /**
   * Verifica se um horário está disponível baseado na data selecionada
   */
  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (!date) return false

    // Verifica se a data selecionada é hoje
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()

    // Se não for hoje, todos os horários estão disponíveis
    if (!isToday) return true

    // Se for hoje, desabilita horários passados
    const [hours, minutes] = timeSlot.split(":").map(Number)
    const slotTime = new Date(date)
    slotTime.setHours(hours, minutes, 0, 0)

    // Adiciona uma margem de segurança de 30 minutos
    const now = new Date()
    const minAllowedTime = new Date(now.getTime() + 30 * 60 * 1000)

    return slotTime >= minAllowedTime
  }

  /**
   * Gera os slots com disponibilidade dinâmica
   */
  const timeSlots = useMemo(() => {
    return allTimeSlots.map((timeSlot) => ({
      time: timeSlot,
      available: isTimeSlotAvailable(timeSlot),
    }))
  }, [date, today])

  useEffect(() => {
    if (!value) {
      setDate(today)
      setTime(undefined)
      return
    }

    const parsed = new Date(value)
    if (isNaN(parsed.getTime())) {
      setDate(today)
      setTime(undefined)
      return
    }

    setDate(parsed)
    const hours = String(parsed.getHours()).padStart(2, "0")
    const minutes = String(parsed.getMinutes()).padStart(2, "0")
    setTime(`${hours}:${minutes}`)
  }, [value, today])

  function emitChange(newDate: Date | undefined, newTime: string | undefined) {
    if (!onChange) return

    if (!newDate || !newTime) {
      onChange(null)
      return
    }

    const [hStr, mStr] = newTime.split(":")
    const hours = Number(hStr)
    const minutes = Number(mStr)

    const combined = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      hours,
      minutes,
      0,
      0
    )

    onChange(combined.toISOString())
  }

  const labelText = date
    ? format(date, "PPP", { locale: ptBR }) + (time ? ` - ${time}` : "")
    : "Selecione data e horário"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative w-[250px]">
          <Button
            type="button"
            variant="outline"
            mode="input"
            className="w-full justify-start gap-2"
          >
            <CalendarIcon className="h-4 w-4 opacity-70" />
            <span className="truncate text-left text-sm">{labelText}</span>
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (!newDate) return
              setDate(newDate)

              // Se o horário selecionado não estiver mais disponível, limpa
              if (time && !isTimeSlotAvailable(time)) {
                setTime(undefined)
                emitChange(newDate, undefined)
              } else {
                emitChange(newDate, time)
              }
            }}
            className="p-2 sm:pe-5"
            disabled={{ before: today }}
          />

          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {date
                        ? format(date, "EEEE, d 'de' MMMM", { locale: ptBR })
                        : "Selecione uma data"}
                    </p>
                  </div>

                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setTime(timeSlot)
                          emitChange(date, timeSlot)
                        }}
                        disabled={!available || !date}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
