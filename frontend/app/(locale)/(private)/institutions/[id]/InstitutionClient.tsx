"use client"

import { useRouter } from "next/navigation" // ✅ App Router
import { useClasses } from "@/hooks/classes/useClasses"

import { DashboardHeader, StatCards } from "./dashboard/components"
import CalendarWidget from "./dashboard/components/CalendarWidget"
import RecentActivities from "./dashboard/components/RecentActivities"
import UpcomingEvents from "./dashboard/components/UpcomingEvents"
import ClassesGrid from "./dashboard/components/ClassesGrid"

export default function InstitutionClient({
  institutionId,
}: {
  institutionId: string
}) {
  const router = useRouter()
  const { data, isLoading, isError } = useClasses(institutionId)

  return (
    <>
      <section className="space-y-5">
        {/* Troque "Ana" depois que ligar com a API do usuário */}
        <DashboardHeader name="Ana" />
        <StatCards />
      </section>

      <section className="mt-6">
        <ClassesGrid
          title="Suas Turmas"
          data={data}
          isLoading={isLoading}
          isError={isError}
          onOpenClass={(class_id) =>
            router.push(`/institutions/${institutionId}/classes/${class_id}`)
          }
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarWidget />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEvents />
        </div>
      </section>

      <section className="mt-6">
        <RecentActivities />
      </section>
    </>
  )
}
