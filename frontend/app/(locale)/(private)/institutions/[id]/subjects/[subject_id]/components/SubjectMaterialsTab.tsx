"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  FileText,
  ExternalLink,
  Loader2,
  ChevronRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import {
  useSubjectMaterials,
  useCreateMaterial,
} from "@/hooks/subjects/materials/useSubjectMaterials"
import { useFileUpload } from "@/hooks/use-file-upload"
import { SubjectMaterialDetailsSheet } from "./SubjectMaterialDetailsSheet"
import { FileUploadComponent } from "../../../components/FileUploadComponent"

interface SubjectMaterialsTabProps {
  institutionId: string
  subjectId: string
  isTeacher: boolean
}

export function SubjectMaterialsTab({
  institutionId,
  subjectId,
  isTeacher,
}: SubjectMaterialsTabProps) {
  const {
    data: materials,
    isLoading,
    isError,
  } = useSubjectMaterials(institutionId, subjectId)

  const createMaterialMutation = useCreateMaterial(institutionId, subjectId)

  const [openDialog, setOpenDialog] = useState(false)
  const [materialTitle, setMaterialTitle] = useState("")
  const [detailsMaterialId, setDetailsMaterialId] = useState<string | null>(
    null
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const loading = isLoading || createMaterialMutation.isPending

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

  const selectedFile = files[0] ?? null

  function resetForm() {
    setMaterialTitle("")
    if (selectedFile) {
      removeFile(selectedFile.id)
    }
  }

  function handleOpenDialog() {
    resetForm()
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    setOpenDialog(false)
    resetForm()
  }

  function handleCreateMaterial(e: React.FormEvent) {
    e.preventDefault()
    if (!materialTitle.trim() || !selectedFile) return

    createMaterialMutation.mutate(
      {
        title: materialTitle.trim(),
        file: selectedFile.file as File,
      },
      {
        onSuccess: () => {
          handleCloseDialog()
        },
      }
    )
  }

  function handleOpenDetails(materialId: string) {
    setDetailsMaterialId(materialId)
    setIsDetailsOpen(true)
  }

  const hasError = isError || createMaterialMutation.isError
  const errorMessage =
    (createMaterialMutation.error as Error)?.message ||
    "Ocorreu um erro ao carregar os materiais."

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header da aba */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Materiais da disciplina
            </h2>
            <p className="text-xs text-muted-foreground">
              Faça upload de apostilas, listas, PDFs e outros materiais de apoio
              para os alunos.
            </p>
          </div>

          {isTeacher && (
            <Button
              size="sm"
              className="mt-1 w-full gap-1.5 text-xs sm:mt-0 sm:w-auto"
              onClick={handleOpenDialog}
            >
              <Plus className="h-3.5 w-3.5" />
              Novo material
            </Button>
          )}
        </div>

        {/* Erros */}
        {hasError && (
          <Alert variant="destructive" className="border-destructive/60">
            <AlertTitle className="text-xs font-semibold">
              Erro ao carregar materiais
            </AlertTitle>
            <AlertDescription className="text-xs">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de materiais */}
        {loading && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="flex h-full flex-col border-border/60 bg-muted/30"
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="mt-2 h-8 w-24 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && (!materials || materials.length === 0) && (
          <Card className="border-dashed border-border/60 bg-muted/20">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Nenhum material cadastrado
              </CardTitle>
              <CardDescription className="text-xs">
                Ainda não há materiais disponíveis para esta disciplina.
                {isTeacher &&
                  " Clique no botão Novo material para enviar o primeiro arquivo."}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!loading && materials && materials.length > 0 && (
          <motion.div
            layout
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          >
            {materials.map((material: any, index: number) => {
              const id = material.material_id ?? material.id

              const file = material.file
              const title =
                material.title ?? file?.filename ?? "Material sem título"

              const description = (
                file?.mime_type
                  ? `Arquivo ${file.mime_type}`
                  : "Material de apoio da disciplina."
              ) as string

              const attachmentUrl = file?.url ?? null

              const createdAt =
                material.created_at &&
                new Date(material.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })

              const fileTag = file?.mime_type
                ? file.mime_type.split("/").pop()
                : null

              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.22,
                    ease: "easeOut",
                    delay: index * 0.02,
                  }}
                  whileHover={{
                    y: -4,
                    scale: 1.01,
                  }}
                >
                  <Card className="group relative flex h-full flex-col overflow-hidden border-border/60 bg-gradient-to-b from-background via-background to-muted/40 shadow-sm transition-colors hover:border-primary/40">
                    {/* barra decorativa no topo */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 opacity-60 group-hover:opacity-100" />

                    <CardHeader className="space-y-1.5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary/10">
                            <FileText className="h-4 w-4" />
                          </span>
                          <span className="line-clamp-1 font-semibold">
                            {title}
                          </span>
                        </CardTitle>

                        {fileTag && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {fileTag}
                          </span>
                        )}
                      </div>

                      {description && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="mt-auto flex items-center justify-between gap-2 border-t border-dashed border-border/60 pt-3">
                      <div className="flex flex-col text-[11px] text-muted-foreground">
                        {createdAt && (
                          <span>
                            Criado em{" "}
                            <span className="font-medium text-foreground">
                              {createdAt}
                            </span>
                          </span>
                        )}
                        {file?.size != null && (
                          <span className="text-[10px] text-muted-foreground/80">
                            {(file.size / 1024).toFixed(1)} kB
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {attachmentUrl && (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs"
                          >
                            <a
                              href={attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Abrir
                            </a>
                          </Button>
                        )}

                        {isTeacher && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenDetails(id)}
                          >
                            Ver detalhes
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Dialog de criação de material */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md overflow-hidden">
          <form
            onSubmit={handleCreateMaterial}
            className="space-y-4 overflow-hidden"
          >
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold">
                Novo material
              </DialogTitle>
              <DialogDescription className="text-xs">
                Preencha as informações abaixo para enviar um novo material de
                apoio para esta disciplina.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Título do material
              </label>
              <Input
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Ex: Lista de exercícios 01"
                className="h-9 text-sm"
                required
              />
            </div>

            <div className="overflow-hidden">
              <FileUploadComponent
                label="Arquivo do material"
                maxSize={maxSize}
                file={selectedFile}
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
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  disabled={createMaterialMutation.isPending}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                size="sm"
                className="w-full sm:w-auto"
                disabled={
                  !materialTitle.trim() ||
                  !selectedFile ||
                  createMaterialMutation.isPending
                }
              >
                {createMaterialMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Criar material"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet de detalhes do material */}
      {isTeacher && detailsMaterialId && (
        <SubjectMaterialDetailsSheet
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open)
            if (!open) {
              setDetailsMaterialId(null)
            }
          }}
          institutionId={institutionId}
          subjectId={subjectId}
          materialId={detailsMaterialId}
        />
      )}
    </>
  )
}
