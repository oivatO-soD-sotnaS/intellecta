"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useInstitutionEventsMock } from "@/hooks/institution-page/useInstitutionEventsMock"

function buildMonth(year: number, monthIdx: number) {
  const first = new Date(year, monthIdx, 1)
  const start = new Date(first)
  start.setDate(first.getDay() === 0 ? 1 : 1 - first.getDay()) // inicia no domingo
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
  return days
}

export default function CalendarWidget() {
  const today = new Date()
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const month = useMemo(
    () => buildMonth(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  )
  const { data: events } = useInstitutionEventsMock()

  const byDay = new Map<string, number>()
  for (const ev of events) {
    byDay.set(ev.date, (byDay.get(ev.date) ?? 0) + 1)
  }

  const label = cursor.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Calendário</h2>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md p-2 hover:bg-muted"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="text-sm font-medium capitalize">{label}</div>
          <button
            className="rounded-md p-2 hover:bg-muted"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </header>

      <Card className="p-3">
        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {month.map((d, i) => {
            const isOtherMonth = d.getMonth() !== cursor.getMonth()
            const key = d.toISOString().slice(0, 10)
            const count = byDay.get(key) ?? 0
            return (
              <div
                key={i}
                className={`aspect-square rounded-md p-1 text-center ${isOtherMonth ? "text-muted-foreground/50" : ""} hover:bg-muted`}
              >
                <div className="text-xs">{d.getDate()}</div>
                {count > 0 && (
                  <div
                    className="mx-auto mt-1 h-2 w-2 rounded-full bg-primary"
                    title={`${count} evento(s)`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
