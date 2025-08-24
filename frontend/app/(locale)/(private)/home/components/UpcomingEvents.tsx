/* eslint-disable @typescript-eslint/no-unused-vars */
// components/UpcomingEvents.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  subtitle: string
  date: Date
}

interface UpcomingEventsProps {
  events: Event[]
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <h4 className="text-lg font-semibold mb-4">Próximos Eventos</h4>
        <ul className="space-y-4">
          {events.map((ev) => {
            const day = ev.date.getDate().toString().padStart(2, "0")
            const month = ev.date
              .toLocaleString("pt-BR", { month: "short" })
              .toUpperCase()

            return (
              <li key={ev.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 text-center">
                  {/* <span className="block text-lg font-bold">{day}</span> */}
                  <span className="block text-xs">{month}</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{ev.title}</h5>
                  <p className="text-sm text-gray-500">{ev.subtitle}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 text-right">
          <Link className="text-sm text-indigo-600" href="/events">
            Ver todos os eventos →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
