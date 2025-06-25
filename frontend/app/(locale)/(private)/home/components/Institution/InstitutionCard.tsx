// components/InstitutionCard.tsx
"use client"

import React from "react"
import Link from "next/link"
import { Card, CardBody } from "@heroui/card"
import { Button } from "@heroui/button"
import { Users, BookOpen } from "lucide-react"

export interface Institution {
  id: string
  name: string
  subtitle: string
  role: string
  members: number
  disciplines: number
  // escolha a cor do gradiente conforme role
  gradientFrom: string
  gradientTo: string
}

interface InstitutionCardProps {
  inst: Institution
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({ inst }) => {
  return (
    <Card className="shadow-none mb-4">
      <CardBody className="p-0">
        {/* topo com gradiente e label */}
        <div
          className={`
            rounded-t-2xl h-16 px-6 flex items-center justify-start
            bg-gradient-to-r from-[${inst.gradientFrom}] to-[${inst.gradientTo}] text-white
          `}
        >
          <span className="text-xs font-medium bg-white bg-opacity-30 px-2 py-1 rounded-full">
            {inst.role}
          </span>
        </div>

        {/* corpo branco */}
        <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-6 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {inst.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {inst.subtitle}
          </p>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mt-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{inst.members.toLocaleString()} membros</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{inst.disciplines} disciplinas</span>
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
      </CardBody>
    </Card>
  )
}
