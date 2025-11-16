// app/(locale)/(private)/institutions/[id]/classes/[classId]/ClassPageClient.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClassHeader } from "./ClassHeader"
import { ClassTabs } from "./ClassTabs"
import { ClassSubjectsTab } from "./ClassSubjectsTab"


type Props = {
  institutionId: string
  classId: string
}

export default function ClassPageClient({ institutionId, classId }: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "subjects" | "people" | "timeline"
  >("subjects")

  // TODO: depois você troca isso pra algo baseado no usuário logado (admin/professor)
  const canManageSubjects = true

  return (
    <motion.div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ClassHeader institutionId={institutionId} classId={classId} />

      <ClassTabs value={activeTab} onValueChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="text-sm text-muted-foreground">
            Em breve: visão geral da turma (resumo, próximos eventos, etc.).
          </div>
        )}

        {activeTab === "subjects" && (
          <ClassSubjectsTab
            institutionId={institutionId}
            classId={classId}
            canManageSubjects={canManageSubjects}
          />
        )}

        {activeTab === "people" && (
          <div className="text-sm text-muted-foreground">
            Em breve: lista de professores e alunos da turma.
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="text-sm text-muted-foreground">
            Em breve: linha do tempo da turma com avisos e atividades.
          </div>
        )}
      </div>
    </motion.div>
  )
}
