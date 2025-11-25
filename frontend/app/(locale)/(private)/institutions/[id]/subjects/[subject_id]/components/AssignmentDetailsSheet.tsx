"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircleIcon,
  PaperclipIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import { formatBytes, useFileUpload } from "@/hooks/use-file-upload"

import {
  useAssignmentById,
  useDeleteAssignment,
  useUpdateAssignment,
} from "@/hooks/subjects/assignments/useSubjectAssignments"
import { DateTimePicker } from "@/components/DatePickerDemo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAssignmentDeadlinesStore } from "@/hooks/subjects/assignments/useAssignmentDeadlinesStore"

interface AssignmentDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  subjectId: string
  assignmentId: string | null
  isTeacher: boolean
}

export function AssignmentDetailsSheet({
  open,
  onOpenChange,
  institutionId,
  subjectId,
  assignmentId,
  isTeacher,
}: AssignmentDetailsSheetProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState<string | null>(null)

  const storedDeadlineEntry = useAssignmentDeadlinesStore((state) =>
    assignmentId ? state.items[assignmentId] : undefined
  )
  const setDeadlineInStore = useAssignmentDeadlinesStore(
    (state) => state.setDeadline
  )
  const removeDeadlineFromStore = useAssignmentDeadlinesStore(
    (state) => state.removeDeadline
  )

  const maxSize = 10 * 1024 * 1024
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
  const newFile = files[0]

  const { data: assignment, isLoading } = useAssignmentById(
    institutionId,
    subjectId,
    assignmentId || undefined
  )

  const updateMutation = useUpdateAssignment(institutionId, subjectId)
  const deleteMutation = useDeleteAssignment(institutionId, subjectId)

  useEffect(() => {
    if (assignment && open) {
      setTitle(assignment.title ?? "")
      setDescription(assignment.description ?? "")

      const backendDeadline: string | null = assignment.deadline ?? null

      const effective = storedDeadlineEntry?.deadlineLocal ?? backendDeadline
      setDeadline(effective)

      if (newFile) {
        removeFile(newFile.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, open, storedDeadlineEntry])

  const handleClose = () => {
    if (updateMutation.isPending || deleteMutation.isPending) return
    onOpenChange(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignmentId) return

    const newFile = files[0]

    updateMutation.mutate(
      {
        assignmentId,
        title: title.trim(),
        description: description.trim(),
        deadline,
        // se o PATCH estiver só com JSON, o campo abaixo será ignorado
        attachment: newFile?.file ?? undefined,
      } as any,
      {
        onSuccess: () => {
          if (deadline && assignmentId && subjectId && institutionId) {
            setDeadlineInStore({
              assignmentId,
              subjectId,
              institutionId,
              deadlineLocal: deadline,
              updatedAt: new Date().toISOString(),
            })
          } else if (assignmentId) {
            // se o usuário limpar a data, removemos do store
            removeDeadlineFromStore(assignmentId)
          }

          handleClose()
        },
      }
    )
  }

  const hasExistingAttachment = !!assignment?.attachment
  const existingAttachmentName = assignment?.attachment?.filename
  const existingAttachmentUrl = assignment?.attachment?.url

  const isBusy = updateMutation.isPending || deleteMutation.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-5">
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-base font-semibold">
            Editar atividade
          </SheetTitle>
          <SheetDescription className="text-xs">
            Ajuste o título, a descrição e a data limite da atividade. As
            alterações serão refletidas para todos os alunos desta disciplina.
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        )}

        {!isLoading && !assignment && (
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade selecionada.
          </p>
        )}

        {!isLoading && assignment && (
          <form
            onSubmit={handleSave}
            className="flex flex-1 flex-col gap-5 overflow-y-auto"
          >
            {/* Bloco 1: informações básicas */}
            <section className="space-y-3 rounded-lg border border-border/60 bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Informações básicas
                </h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  ID: {assignment.assignment_id.slice(0, 8)}…
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Título da atividade
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isTeacher || isBusy}
                    placeholder="Ex.: Lista 01 - Funções do 1º grau"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Descrição
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    disabled={!isTeacher || isBusy}
                    placeholder="Explique o objetivo da atividade, critérios de avaliação, links úteis, etc."
                    className="text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Essa descrição será exibida para os alunos na página da
                    disciplina.
                  </p>
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-xs font-medium text-foreground">
                    Data limite
                  </label>
                  <DateTimePicker value={deadline} onChange={setDeadline} />
                  <p className="text-[11px] text-muted-foreground">
                    Após essa data, novas entregas são bloqueadas.
                  </p>
                </div>
              </div>
            </section>

            {/* Bloco 2: anexo atual e novo anexo */}
            <section className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Arquivos anexos
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  O anexo é opcional.
                </span>
              </div>

              {/* Anexo atual */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-foreground">
                  Anexo atual
                </p>

                {hasExistingAttachment ? (
                  <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <PaperclipIcon className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="truncate">
                        {existingAttachmentName ?? "Arquivo anexado"}
                      </span>
                    </div>
                    {existingAttachmentUrl && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="ml-2 h-7 px-2 text-[11px]"
                      >
                        <a
                          href={existingAttachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={existingAttachmentName ?? undefined}
                        >
                          Baixar
                        </a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Nenhum arquivo anexado a esta atividade.
                  </p>
                )}
              </div>

              {/* Novo anexo (UI opcional) */}
              {isTeacher && (
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-foreground">
                    Substituir / adicionar anexo (opcional)
                  </p>

                  <div
                    role="button"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed border-input bg-background/60 p-3 text-center text-xs transition-colors hover:bg-accent/40 has-disabled:pointer-events-none has-disabled:opacity-50 data-[dragging=true]:bg-accent/40"
                  >
                    <input
                      {...getInputProps()}
                      className="sr-only"
                      aria-label="Upload file"
                      disabled={Boolean(newFile) || isBusy}
                    />

                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background"
                        aria-hidden="true"
                      >
                        <UploadIcon className="h-4 w-4 opacity-60" />
                      </div>
                      <span className="text-xs font-medium">
                        {newFile
                          ? "Novo arquivo selecionado"
                          : "Arraste e solte ou clique para selecionar"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Tamanho máximo {formatBytes(maxSize)}.
                      </span>
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <div
                      className="flex items-center gap-1 text-xs text-destructive"
                      role="alert"
                    >
                      <AlertCircleIcon className="h-3 w-3 shrink-0" />
                      <span>{errors[0]}</span>
                    </div>
                  )}

                  {newFile && (
                    <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <PaperclipIcon className="h-4 w-4 shrink-0 opacity-70" />
                        <span className="truncate">{newFile.file.name}</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => removeFile(newFile.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </section>

            <SheetFooter className="mt-auto flex flex-col gap-3 border-t border-border/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
              {isTeacher && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="inline-flex items-center gap-1"
                      disabled={isBusy}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      Excluir atividade
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deseja realmente excluir esta atividade?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. A atividade será
                        removida permanentemente e as entregas associadas
                        poderão deixar de ser acessíveis para os alunos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleteMutation.isPending}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (!assignmentId) return
                          deleteMutation.mutate(assignmentId, {
                            onSuccess: () => {
                              handleClose()
                            },
                          } as any)
                        }}
                      >
                        {deleteMutation.isPending
                          ? "Excluindo..."
                          : "Sim, excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <div className="flex w-full justify-end gap-2 sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={isBusy}
                >
                  Fechar
                </Button>
                {isTeacher && (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isBusy || !title.trim() || !deadline}
                  >
                    {updateMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
