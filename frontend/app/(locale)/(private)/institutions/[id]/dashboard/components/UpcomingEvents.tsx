"use client"

import { Card } from "@/components/ui/card"
import { useInstitutionEventsMock } from "@/hooks/institution-page/useInstitutionEventsMock"

// Helper estável em SSR/Client
const dtf = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "short",
})

function formatDayMonth(dateLike: string | number | Date) {
  const parts = dtf.formatToParts(new Date(dateLike))
  const day = parts.find(p => p.type === "day")?.value ?? ""
  const month = (parts.find(p => p.type === "month")?.value ?? "").toUpperCase()
  return { day, month }
}

function TypePill({ type }: { type: string }) {
  const map = {
    Prova: "bg-rose-100 text-rose-700",
    Aula: "bg-emerald-100 text-emerald-700",
    Atividade: "bg-indigo-100 text-indigo-700",
  } as const
  const cls = (map as any)[type] ?? "bg-muted text-foreground"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}>
      {type}
    </span>
  )
}

export default function UpcomingEvents() {
  const { data } = useInstitutionEventsMock()

  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold">Próximos Eventos</h2>
      </header>

      <Card className="divide-y">
        {data.map((ev) => {
          const { day, month } = formatDayMonth(ev.date)

          return (
            <div key={ev.id} className="flex items-center gap-3 p-3">
              <div className="w-12 shrink-0 text-center">
                <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {month}
                </div>
                <div className="text-lg font-bold leading-none" suppressHydrationWarning>
                  {day}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <TypePill type={ev.type} />
                  <p className="truncate text-sm font-medium">{ev.title}</p>
                </div>
                {ev.course && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {ev.course}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </Card>
    </section>
  )
}
