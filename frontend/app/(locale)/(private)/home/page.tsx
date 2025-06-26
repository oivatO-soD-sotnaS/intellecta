/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable react/jsx-sort-props */
"use client"

import { useUser } from "../hooks/useUser"

import { Activity, RecentActivities } from "./components/RecentActivities"
import { DashboardBanner } from "./components/DashboardBanner"
import { InstitutionsSection } from "./components/Institution/InstitutionsSection"
import { ProfileCard } from "./components/ProfileCard"
import { UpcomingEvents } from "./components/UpcomingEvents"

export default function HomePage() {
  const { user, loading, error } = useUser()

  // dados estáticos temporários
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

  // enquanto carrega…
  if (loading) return <div>Carregando…</div>
  if (error || !user) return <div>Erro ao carregar perfil.</div>

  // extrai primeiro nome do usuário
  const firstName = user.full_name.split(" ")[0]

  // histórico de atividades e eventos (ainda estático)
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
      {/* Banner ocupa 100% das colunas */}
      <DashboardBanner name={firstName} date={new Date()} />

      {/* Grid principal: 1 coluna no mobile, 3 no lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conteúdo principal (2 colunas em lg) */}
        <div className="lg:col-span-2 space-y-8">
          <InstitutionsSection institutions={institutionsData} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ProfileCard
            name={user.full_name}
            role="Seu cargo aqui"
            institutionsCount={institutionsData.length}
            disciplinesCount={0}
            avatarUrl={
              user.profile_picture_id
                ? `/api/files/${user.profile_picture_id}`
                : undefined
            }
          />
          <RecentActivities activities={activities} />
          <UpcomingEvents events={events} />
        </aside>
      </div>
    </div>
  )
}
