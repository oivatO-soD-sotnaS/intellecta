/* eslint-disable react/jsx-sort-props */

import { DashboardBanner } from "./components/DashboardBanner"
import { InstitutionsSection } from "./components/Institution/InstitutionsSection"
import { ProfileCard } from "./components/ProfileCard"
import { Activity, RecentActivities } from "./components/RecentActivities"
import { UpcomingEvents } from "./components/UpcomingEvents"

export default function HomePage() {
  // Exemplo estático; substitua pelos dados da API
  const data = [
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

  // aqui você carrega dados via fetch
  const profile = {
    name: "Ana Silva",
    role: "Professora e Administradora",
    institutionsCount: 3,
    disciplinesCount: 29,
  }

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
      {/* banner: ocupa todas as colunas */}
      <DashboardBanner name={profile.name.split(" ")[0]} date={new Date()} />

      {/* grid principal: 1 coluna em mobile, 3 em lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* esquerda / conteúdo principal */}
        <div className="lg:col-span-2 space-y-8">
          <InstitutionsSection institutions={data} />
        </div>

        {/* direita / sidebar */}
        <aside className="space-y-6">
          <ProfileCard {...profile} />
          <RecentActivities activities={activities} />
          <UpcomingEvents events={events} />
        </aside>
      </div>
    </div>
  )
}
