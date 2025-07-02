// app/(locale)/(private)/home/components/HomeClient.tsx
"use client"

import React from "react"

import { InstitutionsSection } from "./Institution/InstitutionsSection"
import { ProfileCard } from "./ProfileCard"
import { Activity, RecentActivities } from "./RecentActivities"
import { UpcomingEvents } from "./UpcomingEvents"

export interface User {
  user_id: string
  full_name: string
  email: string
  profile_picture_id?: string
}

interface HomeClientProps {
  user: User
}

export default function HomeClient({ user }: HomeClientProps) {
  // ainda estamos usando dados mock para instituições, atividades e eventos

  const institutionsData = [
    {
      id: "1",
      role: "Admin",
      name: "IFPR – Campus Foz do Iguaçu",
      subtitle: "Instituto Federal do Paraná",
      members: 1234,
      disciplines: 15,
      gradientFrom: "indigo-600",
      gradientTo: "blue-500",
    },
    {
      id: "2",
      role: "Professor",
      name: "Universidade Tecnológica",
      subtitle: "Cursos de Tecnologia",
      members: 856,
      disciplines: 8,
      gradientFrom: "purple-600",
      gradientTo: "violet-500",
    },
    {
      id: "3",
      role: "Aluno",
      name: "Curso de Especialização",
      subtitle: "Desenvolvimento Web Avançado",
      members: 45,
      disciplines: 6,
      gradientFrom: "emerald-600",
      gradientTo: "lime-500",
    },
  ]
  const activities = [
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
  ] as Activity[]

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
          <InstitutionsSection institutions={institutionsData} />
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
            institutionsCount={institutionsData.length}
            name={user.full_name}
          />
          <RecentActivities activities={activities} />
          <UpcomingEvents events={events} />
        </aside>
      </div>
    </div>
  )
}
