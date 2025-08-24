// components/InstitutionsSection.tsx
"use client"

import React, { useState, useEffect } from "react"
import { addToast } from "@heroui/toast"

import { Institution, InstitutionCard } from "./InstitutionCard"
import { CreateInstitutionButton } from "./CreateInstitutionButton"
import { InstitutionModal } from "./InstitutionModal"
import { Card, CardContent } from "@/components/ui/card"

export interface NewInstitutionData {
  name: string
  email: string
  description: string
}

// payload de sucesso vindo da API
interface RawInstitution {
  institution_id: string
  name: string
  description: string
  banner_id?: string | null
  profile_picture_id?: string | null
  role?: string
}

export const InstitutionsSection: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)

  function normalize(raw: RawInstitution): Institution {
    return {
      id: raw.institution_id,
      name: raw.name,
      description: raw.description,
      role: raw.role,
      bannerUrl: raw.banner_id ? `/api/files/${raw.banner_id}` : undefined,
      profilePictureUrl: raw.profile_picture_id
        ? `/api/files/${raw.profile_picture_id}`
        : undefined,
      members: undefined, // ou conte a partir de outro campo
      disciplines: undefined, // idem
    }
  }

  const fetchInstitutions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/institutions")
      const payload: any = await res.json()

      if (!res.ok) {
        throw new Error(payload.error || "Erro ao buscar instituições.")
      }

      const rawData = payload as RawInstitution[]

      setInstitutions(rawData.map(normalize))
    } catch (err: any) {
      addToast({ title: err.message, color: "danger" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstitutions()
  }, [])

  const handleCreate = async (newInst: NewInstitutionData) => {
    const res = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInst),
    })
    const payload: any = await res.json()

    if (!res.ok) {
      throw new Error(payload.error || "Erro ao criar instituição.")
    }

    const raw = payload as RawInstitution

    setInstitutions((prev) => [...prev, normalize(raw)])
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Minhas Instituições</h2>
          <CreateInstitutionButton onClick={() => setModalOpen(true)} />
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p>Carregando instituições...</p>
          ) : institutions.length > 0 ? (
            institutions.map((inst) => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))
          ) : (
            <p>Nenhuma instituição encontrada.</p>
          )}
        </div>

        <InstitutionModal
          isOpen={isModalOpen}
          onCreate={handleCreate}
          onOpenChange={setModalOpen}
        />
      </CardContent>
    </Card>
  )
}
