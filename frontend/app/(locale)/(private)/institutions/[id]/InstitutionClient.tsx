// app/(locale)/(private)/institutions/[id]/InstitutionClient.tsx
"use client"

import React from "react"

import Overview from "./components/Overview"
import MembersList from "./components/MembersList"
import { useInstitution } from "@/hooks/institution/useInstitution"
import { useInstitutionSummary } from "@/hooks/institution/useInstitutionSummary"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"

interface Props {
  id: string
}

export default function InstitutionClient({ id }: Props) {
  const { data: inst, isLoading: lo1, isError: err1 } = useInstitution(id)
  const {
    data: summary,
    isLoading: lo2,
    isError: err2,
  } = useInstitutionSummary(id)
  const {
    data: users = [],
    isLoading: lo3,
    isError: err3,
  } = useInstitutionUsers(id)

  // 1) loading
  if (lo1 || lo2 || lo3) return <p>Carregando...</p>

  console.log("Log erros -> ", err1, err2, err3)
  
  // 2) erro
  if ((err1 && !inst) || (err2 && !summary))
    return <p>Falha ao carregar dados da instituição.</p>

  if (!summary) return null

  return (
    <div className="space-y-8">
      {/* Overview exige um summary não-undefined */}
      <Overview summary={summary} />

      {/* MembersList agora recebe também o id */}
      <MembersList id={id} users={users} />
    </div>
  )
}
