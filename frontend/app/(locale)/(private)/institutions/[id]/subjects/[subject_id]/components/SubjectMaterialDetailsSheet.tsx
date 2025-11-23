"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  ExternalLink,
  Trash2,
  Loader2,
  CalendarClock,
  Hash,
} from "lucide-react"

import {
  useMaterialById,
  useUpdateMaterial,
  useDeleteMaterial,
} from "@/hooks/subjects/materials/useSubjectMaterials"

import { useFileUpload } from "@/hooks/use-file-upload"
import { FileUploadComponent } from "../../../components/FileUploadComponent"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface SubjectMaterialDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  subjectId: string
  materialId: string | null
}

export function SubjectMaterialDetailsSheet({
  open,
  onOpenChange,
  institutionId,
  subjectId,
  materialId,
}: SubjectMaterialDetailsSheetProps) {
  const { data: material, isLoading } = useMaterialById(
    institutionId,
    subjectId,
    materialId ?? undefined
  )

  const updateMutation = useUpdateMaterial(
    institutionId,
    subjectId,
    materialId ?? undefined
  )

  const deleteMutation = useDeleteMaterial(institutionId, subjectId)

  const [title, setTitle] = useState("")

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

  const newFile = files[0] ?? null

  useEffect(() => {
    if (material?.title) {
      setTitle(material.title)
    }
  }, [material?.title, open])

  // limpa upload quando o sheet fecha
  useEffect(() => {
    if (!open && files.length > 0) {
      files.forEach((f) => removeFile(f.id))
    }
  }, [open, files, removeFile])

  function handleSave() {
    if (!materialId) return

    updateMutation.mutate(
      {
        title: title?.trim() || undefined,
        file: newFile ? (newFile.file as File) : undefined,
      },
      {
        onSuccess: () => {
          if (newFile) {
            removeFile(newFile.id)
          }
        },
      }
    )
  }

  function handleDelete() {
    if (!materialId) return

    deleteMutation.mutate(materialId, {
      onSuccess: () => {
        onOpenChange(false)
      },
    } as any)
  }

  const file = material?.file
  const isSaving = updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  const formattedCreatedAt =
    material?.created_at &&
    new Date(material.created_at).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formattedChangedAt =
    material?.changed_at &&
    new Date(material.changed_at).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-4 p-3">
        <SheetHeader className="border-b border-border/60 pb-3">
          <SheetTitle className="text-base font-semibold">
            Detalhes do material
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Visualize e edite as informações deste material. Você também pode
            substituir o arquivo e excluir o material, se necessário.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-xl flex-col gap-6 py-3">
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}

            {!isLoading && material && (
              <>
                {/* Metadados */}
                <section className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Informações gerais
                  </p>

                  <div className="grid gap-2 rounded-xl border border-border/60 bg-muted/40 p-3 text-[11px] text-muted-foreground sm:grid-cols-2">
                    <div className="flex flex-row gap-1 ">
                      <CalendarClock className="mt-[1px] h-3 w-3 shrink-0 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground/80">
                          Criado em
                        </p>
                        <p>{formattedCreatedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarClock className="mt-[1px] h-3 w-3 shrink-0 text-muted-foreground" />
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground/80">
                          Atualizado em
                        </p>
                        <p>{formattedChangedAt}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Título */}
                <section className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Conteúdo
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Título do material
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título do material"
                      className="h-9 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Esse título será exibido para os alunos na lista de
                      materiais.
                    </p>
                  </div>
                </section>

                {/* Arquivo atual */}
                <section className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Arquivo atual
                  </p>

                  <div className="rounded-xl border border-border/60 bg-card/80 p-3 text-xs">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {file?.filename ?? "Arquivo sem nome"}
                      </span>
                    </div>

                    {file ? (
                      <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                        <p>Tipo: {file.mime_type ?? "desconhecido"}</p>
                        <p>
                          Tamanho:{" "}
                          {typeof file.size === "number"
                            ? `${(file.size / 1024).toFixed(1)} kB`
                            : "—"}
                        </p>

                        {file.url && (
                          <Button
                            asChild
                            variant="outline"
                            className="mt-2 h-7 px-2 text-[11px]"
                          >
                            <a href={file.url} target="_blank" rel="noreferrer">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Abrir arquivo
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Nenhum arquivo vinculado a este material.
                      </p>
                    )}
                  </div>
                </section>

                {/* Substituir arquivo */}
                <section className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Substituir arquivo (opcional)
                  </p>

                  <FileUploadComponent
                    label="Upload de arquivo"
                    maxSize={maxSize}
                    file={newFile}
                    errors={errors}
                    isDragging={isDragging}
                    openFileDialog={openFileDialog}
                    handleDragEnter={handleDragEnter}
                    handleDragLeave={handleDragLeave}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    getInputProps={getInputProps}
                    removeFile={removeFile}
                  />

                  <p className="text-[11px] text-muted-foreground">
                    Se você enviar um novo arquivo, ele substituirá o arquivo
                    atual deste material.
                  </p>
                </section>
              </>
            )}

            {!isLoading && !material && (
              <p className="text-sm text-muted-foreground">
                Não foi possível carregar os detalhes deste material.
              </p>
            )}
          </div>
        </div>

        <SheetFooter className="border-t border-border/60 pt-3">
          <div className="mx-auto flex w-full max-w-xl flex-row gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isDeleting || !material}
                    className="gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir material
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir material</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este material? Essa ação
                      não pode ser desfeita e o arquivo deixará de aparecer para
                      os alunos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs sm:text-sm">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      {isDeleting ? "Excluindo..." : "Sim, excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSaving || isDeleting}
              >
                Fechar
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !material}
                className="gap-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
