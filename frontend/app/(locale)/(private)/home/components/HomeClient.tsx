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
  profile_picture_url?: string
}

interface HomeClientProps {
  user: User
}

export default function HomeClient({ user }: HomeClientProps) {
  // Confetti: dispara uma vez quando vier do fluxo de signup
  // React.useEffect(() => {
  //   if (typeof window === "undefined") return

  //   const flag = sessionStorage.getItem("celebrate_signup")
  //   if (flag !== "1") return
  //   sessionStorage.removeItem("celebrate_signup")

  //   // Acessibilidade: respeita usuários que preferem menos animação
  //   if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
  //     return
  //   }

  //   let cancelled = false
  //   const delayMs = 500 // espera um pouco após carregar a Home

  //   const timer = window.setTimeout(async () => {
  //     if (cancelled) return

  //     // import dinâmico → não pesa no bundle normal
  //     const confettiMod = await import("canvas-confetti")
  //     const confetti = confettiMod.default

  //     const duration = 1800 // ms
  //     const start = performance.now()
  //     const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

  //     // Responsivo: menos partículas/escala em telas pequenas
  //     const width = window.innerWidth || 1024
  //     const scalar = width < 420 ? 0.6 : width < 768 ? 0.75 : 0.9
  //     const particleCount = width < 420 ? 6 : 10

  //     // Throttle (em vez de cada frame) → mais leve
  //     const stepEvery = 90 // ms
  //     let last = performance.now()

  //     const tick = (now: number) => {
  //       if (cancelled) return
  //       if (now - start > duration) return

  //       if (now - last >= stepEvery) {
  //         last = now
  //         // Esquerda
  //         confetti({
  //           particleCount,
  //           angle: 60,
  //           spread: 55,
  //           startVelocity: 50,
  //           origin: { x: 0, y: 0.5 },
  //           colors,
  //           scalar,
  //           ticks: 120,
  //           zIndex: 30,
  //         })
  //         // Direita
  //         confetti({
  //           particleCount,
  //           angle: 120,
  //           spread: 55,
  //           startVelocity: 50,
  //           origin: { x: 1, y: 0.5 },
  //           colors,
  //           scalar,
  //           ticks: 120,
  //           zIndex: 30,
  //         })
  //       }

  //       requestAnimationFrame(tick)
  //     }

  //     requestAnimationFrame(tick)
  //   }, delayMs)

  //   return () => {
  //     cancelled = true
  //     clearTimeout(timer)
  //   }
  // }, [])

  // mocks para atividades e eventos (continua igual)
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
