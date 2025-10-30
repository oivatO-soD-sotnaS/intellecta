"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Layers, LibraryBig, Link as LinkIcon } from "lucide-react"

import type { ClassSummary, Subject, ClassSubject } from "./types"
import {
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_CLASS_SUBJECTS_BY_CLASS,
} from "./mocks"
import SubjectsCatalog from "./SubjectsCatalog"
import ClassLinks from "./ClassLinks"
import Back from "../../_components/Back"

export default function ClassesSubjectsClient({
  institutionId,
}: {
  institutionId: string
}) {
  // estado MOCK
  const [classes] = useState<ClassSummary[]>(MOCK_CLASSES)
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS)
  const [links, setLinks] = useState<Record<string, ClassSubject[]>>(
    MOCK_CLASS_SUBJECTS_BY_CLASS
  )

  // Handlers mock
  const createSubject = (s: Subject) => setSubjects((prev) => [s, ...prev])
  const updateSubject = (s: Subject) =>
    setSubjects((prev) =>
      prev.map((x) => (x.subject_id === s.subject_id ? s : x))
    )
  const deleteSubject = (subject_id: string) => {
    setSubjects((prev) => prev.filter((x) => x.subject_id !== subject_id))
    setLinks((prev) => {
      const copy = { ...prev }
      Object.keys(copy).forEach((cid) => {
        copy[cid] = copy[cid].filter(
          (cs) => cs.subject.subject_id !== subject_id
        )
      })
      return copy
    })
  }

  const addSubjectsToClass = (class_id: string, subject_ids: string[]) => {
    const chosen = subjects.filter((s) => subject_ids.includes(s.subject_id))
    setLinks((prev) => ({
      ...prev,
      [class_id]: [
        ...(prev[class_id] ?? []),
        ...chosen.map((s) => ({
          class_subjects_id: `mock-${class_id}-${s.subject_id}-${Date.now()}`,
          class_id,
          subject: s,
        })),
      ],
    }))
  }

  const removeLink = (class_id: string, class_subjects_id: string) => {
    setLinks((prev) => ({
      ...prev,
      [class_id]: (prev[class_id] ?? []).filter(
        (cs) => cs.class_subjects_id !== class_subjects_id
      ),
    }))
  }

  const header = useMemo(
    () => ({
      title: "Turmas e Disciplinas",
      desc: "Crie, edite e duplique disciplinas. Vincule disciplinas às turmas.",
    }),
    []
  )

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <div className="space-x-4">
        <Back hrefFallback={`/institutions/${institutionId}/manage`} />
      </div>
      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <LibraryBig className="h-5 w-5" />
            {header.title}
          </CardTitle>
          <CardDescription>{header.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator />
          <Tabs defaultValue="subjects" className="mt-4">
            <TabsList className="rounded-xl">
              <TabsTrigger value="subjects" className="gap-2">
                <LibraryBig className="h-4 w-4" /> Disciplinas (Catálogo)
              </TabsTrigger>
              <TabsTrigger value="links" className="gap-2">
                <LinkIcon className="h-4 w-4" /> Vínculos por Turma
              </TabsTrigger>
              <TabsTrigger value="classes" className="gap-2">
                <Layers className="h-4 w-4" /> Turmas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="pt-4">
              <SubjectsCatalog
                institutionId={institutionId}
                subjects={subjects}
                onCreate={createSubject}
                onUpdate={updateSubject}
                onDelete={deleteSubject}
              />
            </TabsContent>

            <TabsContent value="links" className="pt-4">
              <ClassLinks
                classes={classes}
                links={links}
                subjectsCatalog={subjects}
                onAdd={addSubjectsToClass}
                onRemove={removeLink}
              />
            </TabsContent>

            <TabsContent value="classes" className="pt-10">
              <div className="text-sm text-muted-foreground">
                Você já possui o CRUD de turmas. Aqui podemos apenas apontar
                para sua tela atual ou embutir um atalho. (Placeholder nesta
                Parte 1)
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
