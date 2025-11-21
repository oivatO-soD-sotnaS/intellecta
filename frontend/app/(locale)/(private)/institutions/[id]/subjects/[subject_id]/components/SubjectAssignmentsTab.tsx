"use client"

import { useState } from "react"
import {
  useCreateAssignment,
  useSubjectAssignment,
} from "@/hooks/subjects/assignments/useSubjectAssignments"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  AlertCircleIcon,
  ClipboardList,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
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
import { DateTimePicker } from "@/components/DatePickerDemo"
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload"
import { AssignmentDetailsSheet } from "./AssignmentDetailsSheet"
import { TopSheet, TopSheetClose, TopSheetContent, TopSheetDescription, TopSheetFooter, TopSheetHeader, TopSheetTitle } from "@/components/ui/top-sheet"

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

  const [submissionsOpen, setSubmissionsOpen] = useState(false)

  const [detailsAssignmentId, setDetailsAssignmentId] = useState<string | null>(
    null
  )

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleOpenDetails = (assignmentId: string) => {
    setDetailsAssignmentId(assignmentId)
    setIsDetailsOpen(true)
  }

  const [openDialog, setOpenDialog] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState<string | null>(null)

  const maxSize = 10 * 1024 * 1024 // 10MB

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    initialFiles: [],
  })

  const file = files[0]

  const { data: assignments, isLoading } = useSubjectAssignment(
    institutionId,
    subjectId
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
    setDeadline("")

    if (file) {
      removeFile(file.id)
    }
  }

  function handleSubmitAssignment(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    if (!deadline) return

    const attachment = file?.file ?? null

    createAssignmentMutation.mutate(
      {
        title,
        description,
        deadline,
        attachment,
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
              onOpenDetails={() => handleOpenDetails(assignment.assignment_id)}
              canManage={isTeacher}
              onSelect={() => {
                setSelectedAssignmentId((prev) => {
                  const next =
                    prev === assignment.assignment_id
                      ? null
                      : assignment.assignment_id

                  if (isTeacher) {
                    setSubmissionsOpen(Boolean(next))
                  }

                  return next
                })
              }}
            />
          ))}
        </div>
      )}

      {/* Painel inferior: professor vê lista de entregas; aluno vê "Minha entrega" */}

      {isTeacher && (
        <TopSheet
          open={submissionsOpen && !!selectedAssignmentId}
          onOpenChange={(open) => {
            setSubmissionsOpen(open)
            if (!open) {
              setSelectedAssignmentId(null)
            }
          }}
        >
          <TopSheetContent>
            <TopSheetHeader>
              <TopSheetTitle>Entregas da atividade</TopSheetTitle>
              <TopSheetDescription>
                Acompanhe, visualize anexos e avalie as entregas dos alunos para
                esta atividade.
              </TopSheetDescription>
            </TopSheetHeader>

            {selectedAssignmentId && (
              <div className="mt-2">
                <AssignmentSubmissionsPanel
                  institutionId={institutionId}
                  subjectId={subjectId}
                  assignmentId={selectedAssignmentId}
                />
              </div>
            )}

            <TopSheetFooter>
              <TopSheetClose asChild>
                <Button variant="outline" size="sm">
                  Fechar
                </Button>
              </TopSheetClose>
            </TopSheetFooter>
          </TopSheetContent>
        </TopSheet>
      )}

      {!isTeacher && selectedAssignmentId && (
        <div className="space-y-3">
          <MySubmissionPanel
            institutionId={institutionId}
            subjectId={subjectId}
            assignmentId={selectedAssignmentId}
          />
        </div>
      )}

      {detailsAssignmentId && (
        <AssignmentDetailsSheet
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          institutionId={institutionId}
          subjectId={subjectId}
          assignmentId={detailsAssignmentId}
          isTeacher={isTeacher}
        />
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
                Data limite
              </label>
              <DateTimePicker
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Anexo (opcional)
              </label>

              <div
                role="button"
                onClick={openFileDialog}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
              >
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Upload file"
                  disabled={Boolean(file)}
                />

                <div className="flex flex-col items-center justify-center text-center">
                  <div
                    className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
                    aria-hidden="true"
                  >
                    <UploadIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">
                    Upload de arquivo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Arraste e solte ou clique para procurar (máx.{" "}
                    {formatBytes(maxSize)})
                  </p>
                </div>
              </div>

              {/* Erros de upload */}
              {errors.length > 0 && (
                <div
                  className="flex items-center gap-1 text-xs text-destructive"
                  role="alert"
                >
                  <AlertCircleIcon className="size-3 shrink-0" />
                  <span>{errors[0]}</span>
                </div>
              )}

              {/* Arquivo selecionado */}
              {file && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <PaperclipIcon
                        className="size-4 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">
                          {file.file.name}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                      onClick={() => removeFile(file.id)}
                      aria-label="Remover arquivo"
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}
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
                disabled={
                  !deadline ||
                  !title.trim() ||
                  !title ||
                  !description ||
                  createAssignmentMutation.isPending
                }
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
