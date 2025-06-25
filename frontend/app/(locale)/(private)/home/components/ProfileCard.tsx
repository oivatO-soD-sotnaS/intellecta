/* eslint-disable @next/next/no-img-element */
// components/ProfileCard.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Card, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { User } from "lucide-react"

interface ProfileCardProps {
  name: string
  role: string
  institutionsCount: number
  disciplinesCount: number
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
    <Card className="rounded-2xl shadow-lg">
      <CardBody className="p-6 space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-center space-x-4">
          {avatarUrl ? (
            <img
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
              src={avatarUrl}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex justify-around border-t border-b py-4">
          <div className="text-center">
            <span className="block text-xl font-bold text-indigo-600">
              {institutionsCount}
            </span>
            <span className="text-xs text-gray-500">Instituições</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-indigo-600">
              {disciplinesCount}
            </span>
            <span className="text-xs text-gray-500">Disciplinas</span>
          </div>
        </div>

        {/* Botão */}
        <Link passHref href="/profile/edit">
          <Button
            className="w-full justify-center"
            color="primary"
            size="sm"
            variant="bordered"
          >
            Editar Perfil
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}
