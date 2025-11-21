"use client"

import { useState } from "react"
import {
  useCreateMaterial,
  useSubjectMaterials,
} from "@/hooks/subjects/materials/useSubjectMaterials"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, ExternalLink, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useFileUpload } from "@/hooks/use-file-upload"
import { FileUploadComponent } from "../../../components/FileUploadComponent"
import { SubjectMaterialDetailsSheet } from "./SubjectMaterialDetailsSheet"
import { motion } from "framer-motion"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface SubjectMaterialsTabProps {
  institutionId: string
  subjectId: string
  isTeacher: boolean
  isLoading?: boolean
}

const ITEMS_PER_PAGE = 6

export default function SubjectMaterialsTab({
  institutionId,
  subjectId,
  isTeacher,
  isLoading,
}: SubjectMaterialsTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [openDialog, setOpenDialog] = useState(false)
  const [materialTitle, setMaterialTitle] = useState("")

  const [detailsMaterialId, setDetailsMaterialId] = useState<string | null>(
    null
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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

  const selectedFile = files[0] ?? null

  const { data: materials, isLoading: isLoadingMaterials } =
    useSubjectMaterials(institutionId, subjectId)

  const createMaterialMutation = useCreateMaterial(institutionId, subjectId)

  const loading = isLoading || isLoadingMaterials

  // Cálculos de paginação
  const totalPages = materials
    ? Math.ceil(materials.length / ITEMS_PER_PAGE)
    : 0
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedMaterials = materials?.slice(startIndex, endIndex) || []

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Gera os números das páginas para exibir
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("ellipsis")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  function handleOpenDetails(materialId: string) {
    setDetailsMaterialId(materialId)
    setIsDetailsOpen(true)
  }

  function handleDetailsOpenChange(open: boolean) {
    setIsDetailsOpen(open)
    if (!open) {
      setDetailsMaterialId(null)
    }
  }

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    if (createMaterialMutation.isPending) return

    setOpenDialog(false)
    setMaterialTitle("")

    if (selectedFile) {
      removeFile(selectedFile.id)
    }
  }

  function handleSubmitMaterial(e: React.FormEvent) {
    e.preventDefault()

    if (!materialTitle.trim() || !selectedFile) return

    createMaterialMutation.mutate(
      {
        title: materialTitle.trim(),
        file: selectedFile.file as File,
      },
      {
        onSuccess() {
          handleCloseDialog()
          // Volta para a primeira página após criar
          setCurrentPage(1)
        },
      }
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Materiais da disciplina</h2>
        <div className="flex items-center gap-2">
          {!loading && materials && materials.length > 0 && totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={handlePrevious}
                    size="default"
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        size="default"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageClick(page)
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={handleNext}
                    size="default"
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          {isTeacher && (
            <Button size="sm" variant="outline" onClick={handleOpenDialog}>
              Novo material
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/60">
              <CardHeader className="space-y-2 pb-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && (!materials || materials.length === 0) && (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum material foi cadastrado para esta disciplina ainda.
            </p>
            {isTeacher && (
              <p className="text-xs text-muted-foreground/80">
                Use o botão &quot;Novo material&quot; para adicionar conteúdos
                para os alunos.
              </p>
            )}
          </CardContent>
        </Card>
      )}
      {!loading && materials && materials.length > 0 && (
        <motion.div layout className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {paginatedMaterials.map((material: any, index: number) => {
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

      {/* Dialog de criação de material */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle>Novo material</DialogTitle>
            <DialogDescription>
              Cadastre um novo material para os alunos desta disciplina.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmitMaterial}
            className="space-y-3 py-2 overflow-hidden"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Título
              </label>
              <Input
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Ex.: Aula 1 - Introdução"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseDialog}
                disabled={createMaterialMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  createMaterialMutation.isPending ||
                  !materialTitle.trim() ||
                  !selectedFile
                }
              >
                {createMaterialMutation.isPending
                  ? "Salvando..."
                  : "Criar material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isTeacher && detailsMaterialId && (
        <SubjectMaterialDetailsSheet
          open={isDetailsOpen}
          onOpenChange={handleDetailsOpenChange}
          institutionId={institutionId}
          subjectId={subjectId}
          materialId={detailsMaterialId}
        />
      )}
    </section>
  )
}
