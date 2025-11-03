"use client"

import * as React from "react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import SubjectHeader from "./SubjectHeader"
import OverviewPanel from "./SubjectOverview"
import SubjectEditSheet from "./SubjectEditSheet"
import SubjectUnlinkDialog from "./SubjectUnlinkDialog"

type Props = {
  institutionId: string
  subjectId: string
  classId?: string // quando vier de /subjects da turma
}

export default function SubjectDetailsClient({
  institutionId,
  subjectId,
  classId,
}: Props) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [unlinkOpen, setUnlinkOpen] = React.useState(false)
  const params = useSearchParams()
  const router = useRouter()

  const currentTab = params.get("view") ?? "overview"

  const setTab = (view: string) => {
    const sp = new URLSearchParams(params.toString())
    sp.set("view", view)
    router.replace(`?${sp.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-4">
      <SubjectHeader
        institutionId={institutionId}
        subjectId={subjectId}
        classId={classId}
        onEdit={() => setEditOpen(true)}
        onUnlink={() => setUnlinkOpen(true)}
        onBack={
          classId
            ? () =>
                router.push(
                  `/institutions/${institutionId}/manage/classes-subjects?classId=${classId}#subjects`
                )
            : undefined
        }
      />

      <Tabs value={currentTab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="assignments">Atividades</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewPanel institutionId={institutionId} subjectId={subjectId} />
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          {/* TODO: ligar AssignmentsView quando implementarmos os hooks/rotas */}
          <div className="text-sm text-muted-foreground">
            Em breve: gerenciamento de atividades da disciplina.
          </div>
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          {/* TODO: ligar MaterialsView quando implementarmos os hooks/rotas */}
          <div className="text-sm text-muted-foreground">
            Em breve: materiais didáticos da disciplina.
          </div>
        </TabsContent>
      </Tabs>

      <SubjectEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        institutionId={institutionId}
        subjectId={subjectId}
      />

      {classId && (
        <SubjectUnlinkDialog
          open={unlinkOpen}
          onOpenChange={setUnlinkOpen}
          institutionId={institutionId}
          classId={classId}
          subjectId={subjectId}
          onUnlinked={() => {
            // volta para a lista de subjects da turma
            router.push(
              `/institutions/${institutionId}/manage/classes-subjects?classId=${classId}#subjects`
            )
          }}
        />
      )}
    </div>
  )
}
