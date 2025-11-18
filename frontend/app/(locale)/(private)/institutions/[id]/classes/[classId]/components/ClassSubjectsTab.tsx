// app/(locale)/(private)/institutions/[id]/classes/[classId]/_components/ClassSubjectsTab.tsx
"use client"

import { useMemo, useState, FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MessageCircle, Link2, Loader2 } from "lucide-react"

import {
  useClassSubjects,
  useAddSubjectToClass,
  useRemoveClassSubject,
  type ClassSubject,
} from "@/hooks/classes/useClassSubjects"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubjectsSkeleton } from "./SubjectsSkeleton"
import { SubjectsGrid } from "./SubjectsGrid"
import { CreateSubjectSheet } from "./CreateSubjectSheet"


type Props = {
  institutionId: string
  classId: string
  canManageSubjects?: boolean
}

export function ClassSubjectsTab({
  institutionId,
  classId,
  canManageSubjects,
}: Props) {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const {
    data: classSubjects,
    isLoading,
    isError,
    refetch,
  } = useClassSubjects(institutionId, classId)

  const filtered = useMemo(() => {
    if (!classSubjects) return []
    const term = search.trim().toLowerCase()
    if (!term) return classSubjects
    return classSubjects.filter(({ subject }) =>
      subject.name.toLowerCase().includes(term)
    )
  }, [classSubjects, search])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Disciplinas da turma</h2>
          <p className="text-xs text-muted-foreground">
            Veja as disciplinas vinculadas a esta turma e acesse rapidamente o
            fórum de cada uma.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar disciplina..."
            className="h-9 w-full sm:w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {canManageSubjects && (
            <Button
              size="sm"
              className="mt-1 flex items-center gap-1.5 sm:mt-0"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Nova disciplina
            </Button>
          )}
        </div>
      </div>

      {isLoading && <SubjectsSkeleton />}

      {isError && !isLoading && (
        <div className="flex flex-col items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <span>Não foi possível carregar as disciplinas da turma.</span>
          <Button size="lg" variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border/60 px-4 py-8 text-center text-xs text-muted-foreground">
              <p>Nenhuma disciplina encontrada para esta turma.</p>
              {canManageSubjects && (
                <p>
                  Clique em{" "}
                  <span className="font-semibold">“Nova disciplina”</span> para
                  criar uma disciplina e, se desejar, vinculá-la a esta turma.
                </p>
              )}
            </div>
          ) : (
            <SubjectsGrid
              institutionId={institutionId}
              classId={classId}
              classSubjects={filtered}
              canManageSubjects={canManageSubjects}
            />
          )}
        </>
      )}

      {canManageSubjects && (
        <CreateSubjectSheet
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          institutionId={institutionId}
          classId={classId}
        />
      )}
    </section>
  )
}


