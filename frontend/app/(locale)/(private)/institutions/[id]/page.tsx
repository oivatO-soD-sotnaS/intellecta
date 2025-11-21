"use client"

import { useRouter } from "next/navigation" 
import { useClasses } from "@/hooks/classes/useClasses"

import { DashboardHeader } from "./dashboard/components"
import CalendarWidget from "./dashboard/components/CalendarWidget"
import ClassesCarousel from "./dashboard/components/ClassesCarousel"
import UpcomingAssignments from "./dashboard/components/upcoming-assignments/UpcomingAssignments"
import { useInstitution } from "./layout"

export default function InstitutionClient() {
  const { institution } = useInstitution()
  const router = useRouter()
  const { data, isLoading, isError } = useClasses(institution.institution_id)  

  return (
    <>
      <section className="space-y-5">
        {/* Troque "Ana" depois que ligar com a API do usuário */}
        <DashboardHeader />
      </section>

      <section className="mt-6 bg-secondary rounded-xl p-6 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <ClassesCarousel
          title="Suas Turmas"
          data={data}
          isLoading={isLoading}
          isError={isError}
          onOpenClass={(classId) => {
            router.push(`/institutions/${institution.institution_id}/classes/${classId}`)
          }}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarWidget institutionId={institution.institution_id}/>
        </div>
        <div className="lg:col-span-1">
          <UpcomingAssignments institutionId={institution.institution_id}/>
        </div>
      </section>
    </>
  )
}
