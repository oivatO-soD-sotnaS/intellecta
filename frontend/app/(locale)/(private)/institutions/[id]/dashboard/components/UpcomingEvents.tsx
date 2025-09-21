"use client"



import { Card } from "@/components/ui/card"
import { useInstitutionEventsMock } from "@/hooks/institution-page/useInstitutionEventsMock"

function TypePill({ type }: { type: string }) {
  const map = {
    Prova: "bg-rose-100 text-rose-700",
    Aula: "bg-emerald-100 text-emerald-700",
    Atividade: "bg-indigo-100 text-indigo-700",
  } as const
  const cls = (map as any)[type] ?? "bg-muted text-foreground"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${cls}`}
    >
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
          const date = new Date(ev.date)
          const day = String(date.getDate()).padStart(2, "0")
          const month = date
            .toLocaleDateString("pt-BR", { month: "short" })
            .toUpperCase()

          return (
            <div key={ev.id} className="flex items-center gap-3 p-3">
              <div className="w-12 shrink-0 text-center">
                <div className="text-xs text-muted-foreground">{month}</div>
                <div className="text-lg font-bold leading-none">{day}</div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <TypePill type={ev.type} />
                  <p className="truncate text-sm font-medium">{ev.title}</p>
                </div>
                {ev.course && (
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
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
