// components/InstitutionsSection.tsx
"use client"

import React from "react"
import { Card, CardBody } from "@heroui/card"

import { Institution, InstitutionCard } from "./InstitutionCard"
import { CreateInstitutionButton } from "./CreateInstitutionButton"
import { InstitutionModal } from "./InstitutionModal"

export interface NewInstitutionData {
  name: string
  email: string
  phone?: string
  description: string
}

interface InstitutionsSectionProps {
  institutions: Institution[]
  /** Vai ser chamado com os dados do form depois que o usuário submeter */
  onCreateInstitution?: (data: NewInstitutionData) => Promise<void>
}

export const InstitutionsSection: React.FC<InstitutionsSectionProps> = ({
  institutions,
  onCreateInstitution,
}) => {
  const [isModalOpen, setModalOpen] = React.useState(false)

  /** passa direto ao modal; quem usar esta seção decide o que fazer */
  const handleCreate = async (data: NewInstitutionData) => {
    if (onCreateInstitution) {
      await onCreateInstitution(data)
    }
    setModalOpen(false)
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardBody className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Minhas Instituições
            </h2>
            <CreateInstitutionButton onClick={() => setModalOpen(true)} />
          </div>

          {/* Lista de cartões */}
          <div className="space-y-4">
            {institutions.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))}
          </div>

          {/* Modal de criação */}
          {isModalOpen && (
            <InstitutionModal
              onClose={() => setModalOpen(false)}
              onCreate={handleCreate}
            />
          )}
        </div>
      </CardBody>
    </Card>
  )
}
