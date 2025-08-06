// app/(locale)/(private)/institution/[id]/InstitutionClient.tsx
"use client"

import React from "react"
import { useInstitution } from "@/hooks/institution/useInstitution"
import { useInstitutionSummary } from "@/hooks/institution/useInstitutionSummary"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"
import { useInstitutionUI } from "@/store/institutionStore"

import InstitutionHeader from "./components/Header"
import Nav from "./components/Nav"
import Overview from "./components/Overview"
import CoursesList from "./components/CoursesList"
import MembersList from "./components/MembersList"
import Settings from "./components/Settings"
import { Spinner } from "@heroui/spinner"

interface Props {
  params: { id: string }
}

export default function InstitutionClient({ params }: Props) {
  const { id } = params

  const { data: inst, isLoading: li1, error: e1 } = useInstitution(id)

  const { data: sum, isLoading: li2, error: e2 } = useInstitutionSummary(id)

  const { data: users, isLoading: li3, error: e3 } = useInstitutionUsers(id)

  const { activeTab, setActiveTab } = useInstitutionUI()

  const isLoading = li1 || li2 || li3
  const error = e1 || e2 || e3

  if (isLoading) return <Spinner />
  if (error) return <div className="p-6 text-red-600">Deu erro!</div>

  if (!sum) return <div className="p-6">Resumo não disponível.</div>

  return (
    <div className="space-y-6">
      {/* Header com dados básicos e resumo */}
      {/* <InstitutionHeader institution={inst!} summary={sum} /> */}

      {/* Nav de abas */}
      <Nav activeTab={activeTab} onChange={setActiveTab} />

      {/* Conteúdo por aba */}
      <div>
        {activeTab === "overview" && <Overview summary={sum} />}
        {activeTab === "courses" && <CoursesList  />}
        {activeTab === "members"   && (
          <MembersList users={users!} institutionId={id} />
        )}
        {activeTab === "settings"  && <Settings institution={inst!} />}
      </div>
    </div>
  )
}
