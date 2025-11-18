"use client"

import { useState } from "react"
import { useCreateAssignment, useSubjectAssignments } from "@/hooks/subjects/useSubjectAssignments"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ClipboardList } from "lucide-react"
import AssignmentCard from "./AssignmentCard"
import AssignmentSubmissionsPanel from "./AssignmentSubmissionsPanel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import MySubmissionPanel from "./assignments/MySubmissionPanel"

interface SubjectAssignmentsTabProps {
  institutionId: string
  subjectId: string
  isTeacher: boolean
}

export default function SubjectAssignmentsTab({
  institutionId,
  subjectId,
  isTeacher,
}: SubjectAssignmentsTabProps) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

  const { data: assignments, isLoading } = useSubjectAssignments(
    institutionId,
    subjectId,
  )

  const createAssignmentMutation = useCreateAssignment(institutionId, subjectId)

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    if (createAssignmentMutation.isPending) return
    setOpenDialog(false)
    setTitle("")
    setDescription("")
    setDueDate("")
  }

  function handleSubmitAssignment(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    createAssignmentMutation.mutate(
      {
        institutionId,
        subjectId,
        payload: {
          title,
          description,
          // ajuste o nome do campo conforme o backend (due_date, deadline, etc.)
          due_date: dueDate || null,
        },
      },
      {
        onSuccess(data: any) {
          setSelectedAssignmentId(data.assignment_id ?? null)
          handleCloseDialog()
        },
      }
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Atividades da disciplina</h2>
        {isTeacher && (
          <Button size="sm" variant="outline" onClick={handleOpenDialog}>
            Nova atividade
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/60 p-4">
              <Skeleton className="mb-2 h-4 w-40" />
              <Skeleton className="mb-1 h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!assignments || assignments.length === 0) && (
        <Card className="border-dashed border-border/60">
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhuma atividade foi cadastrada para esta disciplina ainda.
            </p>
            {isTeacher && (
              <p className="text-xs text-muted-foreground/80">
                Use o botão &quot;Nova atividade&quot; para criar uma nova
                tarefa ou avaliação.
              </p>
            )}
          </div>
        </Card>
      )}

      {!isLoading && assignments && assignments.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment: any) => (
            <AssignmentCard
              key={assignment.assignment_id}
              assignment={assignment}
              isSelected={selectedAssignmentId === assignment.assignment_id}
              onSelect={() =>
                setSelectedAssignmentId((prev) =>
                  prev === assignment.assignment_id
                    ? null
                    : assignment.assignment_id
                )
              }
            />
          ))}
        </div>
      )}

      {/* Painel inferior: professor vê lista de entregas; aluno vê "Minha entrega" */}
      {selectedAssignmentId && (
        <div className="space-y-3">
          {isTeacher ? (
            <AssignmentSubmissionsPanel
              institutionId={institutionId}
              subjectId={subjectId}
              assignmentId={selectedAssignmentId}
            />
          ) : (
            <MySubmissionPanel
              institutionId={institutionId}
              subjectId={subjectId}
              assignmentId={selectedAssignmentId}
            />
          )}
        </div>
      )}

      {/* Dialog de criação de atividade */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova atividade</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa ou avaliação para os alunos desta disciplina.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitAssignment} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Título
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Tarefa 1 - Exercícios de revisão"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Descrição
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Explique o que os alunos devem fazer."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Data limite (opcional)
              </label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Ajuste o campo enviado conforme o atributo esperado pelo backend
                (ex.: due_date).
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseDialog}
                disabled={createAssignmentMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createAssignmentMutation.isPending}
              >
                {createAssignmentMutation.isPending
                  ? "Criando..."
                  : "Criar atividade"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
