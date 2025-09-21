"use client"

import { Card } from "@/components/ui/card"
import { useMemo, useState } from "react"
import ActivityItem from "./ActivityItem"
import { ActivityKind } from "../_mocks/activities.mock"
import { useInstitutionRecentActivitiesMock } from "@/hooks/institution-page/useInstitutionRecentActivitiesMock"
import { Chip } from "@heroui/chip"


const FILTERS: ({ key: "todas" } | { key: ActivityKind })[] = [
  { key: "todas" },
  { key: "atividade" },
  { key: "material" },
  { key: "forum" },
]

export default function RecentActivities() {
  const { data } = useInstitutionRecentActivitiesMock()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("todas")

  const list = useMemo(() => {
    if (filter === "todas") return data
    return data.filter((a) => a.kind === filter)
  }, [data, filter])

  return (
    <section className="mt-6">
      <Card className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Atividades Recentes</h2>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <Chip 
                key={f.key}
                variant={filter === f.key ? "solid" : "flat"}
                color={filter === f.key ? "secondary" : "default"}
                className="cursor-pointer"
                onClick={() => setFilter(f.key)}
              >
                {f.key === "todas"
                  ? "Todas"
                  : f.key === "atividade"
                    ? "Atividades"
                    : f.key === "material"
                      ? "Materiais"
                      : "Fórum"}
              </Chip>
            ))}
          </div>
        </div>

        <div className="divide-y rounded-xl">
          {list.map((a) => (
            <div key={a.id} className="py-1 first:pt-0 last:pb-0">
              <ActivityItem activity={a} />
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}
