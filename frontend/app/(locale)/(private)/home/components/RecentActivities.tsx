// components/RecentActivities.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Card, CardBody } from "@heroui/card"
import {
  FileText,
  Calendar as CalendarIcon,
  BookOpen,
  MessageSquare,
} from "lucide-react"

export interface Activity {
  id: string
  title: string
  subtitle: string
  when: string
  type: "assignment" | "event" | "review" | "discussion"
}

const iconsMap = {
  assignment: <FileText className="h-5 w-5 text-indigo-600" />,
  event: <CalendarIcon className="h-5 w-5 text-green-600" />,
  review: <BookOpen className="h-5 w-5 text-blue-600" />,
  discussion: <MessageSquare className="h-5 w-5 text-purple-600" />,
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardBody className="p-6">
        <h4 className="text-lg font-semibold mb-4">Atividades Recentes</h4>
        <ul className="space-y-4">
          {activities.map((act) => (
            <li key={act.id} className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {iconsMap[act.type]}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{act.title}</h5>
                <p className="text-sm text-gray-500">{act.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">{act.when}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <Link className="text-sm text-indigo-600" href="/activities">
            Ver todas as atividades →
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}
