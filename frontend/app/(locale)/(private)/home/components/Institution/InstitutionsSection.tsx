// components/InstitutionsSection.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardBody } from "@heroui/card"
import { addToast } from "@heroui/toast"

import { Institution, InstitutionCard } from "./InstitutionCard"
import { CreateInstitutionButton } from "./CreateInstitutionButton"
import { InstitutionModal } from "./InstitutionModal"

export interface NewInstitutionData {
  name: string
  email: string
  description: string
}

export const InstitutionsSection: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  // 1) Busca inicial de instituições
  const fetchInstitutions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/institutions")
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erro ao buscar instituições.")
      setInstitutions(data)
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstitutions()
  }, [])

  // 2) Criação de nova instituição
  const handleCreate = async (newInst: NewInstitutionData) => {
    const res = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInst),
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error || "Erro ao criar instituição.")
    // Atualiza lista localmente
    setInstitutions((prev) => [...prev, data])
  }

  return (
    <Card className="w-full">
      <CardBody>
        {/* Cabeçalho com botão de criação */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Minhas Instituições</h2>
          <CreateInstitutionButton onClick={() => setModalOpen(true)} />
        </div>

        {/* Lista ou indicador de carregamento */}
        <div className="space-y-4">
          {isLoading ? (
            <p>Carregando instituições...</p>
          ) : (
            institutions.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))
          )}
        </div>

        {/* Modal de criação */}
        <InstitutionModal
          isOpen={isModalOpen}
          onCreate={handleCreate}
          onOpenChange={setModalOpen}
        />
      </CardBody>
    </Card>
  )
}
