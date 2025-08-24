/* eslint-disable @next/next/no-img-element */
// components/ProfileCard.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@heroui/button"
import { User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileCardProps {
  name: string
  role?: string
  institutionsCount?: number
  disciplinesCount?: number
  avatarUrl?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  institutionsCount,
  disciplinesCount,
  avatarUrl,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg w-full">
      <CardContent className="p-6 space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-4">
          {avatarUrl ? (
            <img
              alt={name}
              className="w-14 h-14 rounded-full object-cover"
              src={avatarUrl}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-7 w-7 text-gray-500 dark:text-gray-300" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex justify-between border-t border-b pt-4 pb-4">
          <div className="flex-1 text-center">
            <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {institutionsCount}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Instituições
            </span>
          </div>
          <div className="flex-1 text-center">
            <span className="block text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {disciplinesCount}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Disciplinas
            </span>
          </div>
        </div>

        {/* Botão Editar */}
        <Link href="/profile">
          <Button className="w-full" color="primary" size="md" variant="solid">
            Editar Perfil
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
