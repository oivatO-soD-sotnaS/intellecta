// app/(locale)/(private)/home/components/HomeClient.tsx
"use client"

import React from "react"

import { ProfileCard } from "./ProfileCard"
import { Activity, RecentActivities } from "./RecentActivities"
import { UpcomingEvents } from "./UpcomingEvents"
import InstitutionsSection from "./Institution/InstitutionsSection"

export interface User {
  user_id: string
  full_name: string
  email: string
  profile_picture_id?: string
  profile_picture_url?: string
}

interface HomeClientProps {
  user: User
}

export default function HomeClient({ user }: HomeClientProps) {

  const activities: Activity[] = [
    {
      id: "1",
      title: "Trabalho Final",
      subtitle: "Matemática Avançada",
      when: "Entrega em 2 dias",
      type: "assignment",
    },
    {
      id: "2",
      title: "Prova Bimestral",
      subtitle: "Física III",
      when: "Amanhã às 14:00",
      type: "event",
    },
    {
      id: "3",
      title: "Aula de Revisão",
      subtitle: "Programação Web",
      when: "Hoje às 16:00",
      type: "review",
    },
    {
      id: "4",
      title: "Nova discussão",
      subtitle: "Fórum de Algoritmos",
      when: "2 horas atrás",
      type: "discussion",
    },
  ]

  const events = [
    {
      id: "1",
      title: "Entrega do Trabalho Final",
      subtitle: "Matemática Avançada",
      date: new Date(2025, 5, 25),
    },
    {
      id: "2",
      title: "Prova Bimestral",
      subtitle: "Física III",
      date: new Date(2025, 5, 26),
    },
    {
      id: "3",
      title: "Aula de Revisão",
      subtitle: "Programação Web",
      date: new Date(2025, 5, 28),
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-8">
          <InstitutionsSection />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ProfileCard
            avatarUrl={
              user.profile_picture_id
                ? `/api/files/${user.profile_picture_id}`
                : undefined
            }
            disciplinesCount={0}
            name={user.full_name}
          />

          <RecentActivities activities={activities} />
          <UpcomingEvents events={events} />
        </aside>
      </div>
    </div>
  )
}
