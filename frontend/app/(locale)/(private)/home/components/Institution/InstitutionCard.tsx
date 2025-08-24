// components/InstitutionCard.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@heroui/button"
import { Users, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface Institution {
  id: string
  name: string
  description?: string
  bannerUrl?: string | undefined
  profilePictureUrl?: string | undefined
  role?: string
  members?: number
  disciplines?: number
}

interface InstitutionCardProps {
  inst: Institution
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ inst }) => {
  // Subtítulo (descrição) e contagens com fallback
  const subtitle = inst.description || ""
  const members = inst.members ?? 0
  const disciplines = inst.disciplines ?? 0

  // Classes de gradiente conforme o role
  let fromColor = "from-gray-500"
  let toColor = "to-gray-700"

  switch (inst.role) {
    case "admin":
      fromColor = "from-indigo-600"
      toColor = "to-purple-600"
      break
    case "teacher":
      fromColor = "from-blue-600"
      toColor = "to-green-600"
      break
    case "student":
      fromColor = "from-gray-400"
      toColor = "to-gray-600"
      break
  }

  return (
    <Card className="shadow-none mb-4">
      <CardContent className="p-0">
        {/* Cabeçalho com gradiente */}
        <div
          className={`
            rounded-t-2xl h-16 px-6 flex items-center justify-start
            bg-gradient-to-r ${fromColor} ${toColor} text-white
          `}
        >
          {inst.role && (
            <span className="text-xs font-medium bg-white bg-opacity-30 px-2 py-1 rounded-full">
              {inst.role}
            </span>
          )}
        </div>

        {/* Corpo do card */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-6 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {inst.name}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mt-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{members.toLocaleString()} membros</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{disciplines} disciplinas</span>
            </div>
          </div>

          <div className="mt-6">
            <Link passHref href={`/institutions/${inst.id}`}>
              <Button className="w-full justify-center text-sm" variant="flat">
                Acessar →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
