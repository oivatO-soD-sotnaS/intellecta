// app/(locale)/(private)/institutions/[id]/components/Overview.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  ClipboardList,
  Calendar as CalendarIcon,
  MessageCircle,
} from "lucide-react"
import type { InstitutionSummaryDto } from "../schema/institutionSchema"
import { Card, CardContent } from "@/components/ui/card"

interface OverviewProps {
  summary: InstitutionSummaryDto & {
    pendingActivities: number
    upcomingEvents: number
    unreadMessages: number
  }
}

export default function Overview({ summary }: OverviewProps) {
  const items = [
    {
      label: "Atividades Pendentes",
      value: summary.pendingActivities,
      icon: ClipboardList,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      label: "Eventos Próximos",
      value: summary.upcomingEvents,
      icon: CalendarIcon,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Mensagens Não Lidas",
      value: summary.unreadMessages,
      icon: MessageCircle,
      iconBg: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(({ label, value, icon: Icon, iconBg }, idx) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
        >
          <Card className="rounded-lg shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-2 rounded-md ${iconBg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
