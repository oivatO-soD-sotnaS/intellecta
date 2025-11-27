// app/(locale)/(private)/institutions/[id]/classes/[classId]/components/ClassPageClient.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClassHeader } from "./ClassHeader"
import { ClassTabs } from "./ClassTabs"
import { ClassSubjectsTab } from "./ClassSubjectsTab"
import { useClass } from "@/hooks/classes/useClasses"
import { ClassPeopleTab } from "./ClassPeopleTab"
import { ClassTimelineTab } from "./ClassTimelineTab"
import { ClassOverviewTab } from "./ClassOverviewTab"

// 🔹 importa o contexto da instituição (que já te dá o "me")
import { useInstitution } from "../../../layout"

type Props = {
  institutionId: string
  classId: string
}

export default function ClassPageClient({ institutionId, classId }: Props) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "subjects" | "people" | "timeline"
  >("subjects")

  // pega institution + me (com role: "admin" | "teacher" | "student")
  const { me } = useInstitution()

  // role atual do usuário na instituição
  const userRole = me.role // "admin" | "teacher" | "student"

  // regra de permissão pra gerir disciplinas da turma
  const canManageSubjects = userRole === "admin" || userRole === "teacher"

  const { data: classData, isLoading } = useClass(institutionId, classId)

  return (
    <motion.div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ClassHeader
        institutionId={institutionId}
        classData={classData}
        isLoading={isLoading}
      />

      <ClassTabs value={activeTab} onValueChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "overview" && (
          <ClassOverviewTab
            institutionId={institutionId}
            classId={classId}
          />
        )}

        {activeTab === "subjects" && (
          <ClassSubjectsTab
            institutionId={institutionId}
            classId={classId}
            canManageSubjects={canManageSubjects}
          />
        )}

        {activeTab === "people" && (
          <ClassPeopleTab
            institutionId={institutionId}
            classId={classId}
          />
        )}

        {activeTab === "timeline" && (
          <ClassTimelineTab
            institutionId={institutionId}
            classId={classId}
          />
        )}
      </div>
    </motion.div>
  )
}
