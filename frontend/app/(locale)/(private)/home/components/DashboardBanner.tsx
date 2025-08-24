// components/DashboardBanner.tsx
"use client"

import React from "react"
import { ClipboardList, Calendar, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: number
  icon: React.ReactNode
}

interface DashboardBannerProps {
  name: string
  date: Date
  stats?: StatItem[]
}

export const DashboardBanner: React.FC<DashboardBannerProps> = ({
  name,
  date,
  stats = [
    { label: "Atividades Pendentes", value: 10, icon: <ClipboardList /> },
    { label: "Eventos Próximos", value: 22, icon: <Calendar /> },
    { label: "Mensagens Não Lidas", value: 9, icon: <Mail /> },
  ],
}) => {
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <Card className="w-full rounded-2xl overflow-hidden">
      <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
        {/* Boas-vindas */}
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">
            Olá, {name}! <span role="img">👋</span>
          </h2>
          <p className="mt-1 text-sm opacity-90">
            Bem-vinda de volta à sua plataforma educacional. Hoje é{" "}
            {formattedDate}.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex space-x-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 w-32"
            >
              <div className="p-2 rounded-lg bg-white bg-opacity-30 mb-2">
                {React.cloneElement(stat.icon as React.ReactElement, {
                  className: "h-6 w-6 text-white",
                })}
              </div>
              <span className="text-xl font-semibold">{stat.value}</span>
              <span className="text-xs text-white opacity-90 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
