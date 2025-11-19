"use client"

import { useState } from "react"
import {
  useCreateMaterial,
  useSubjectMaterials,
} from "@/hooks/subjects/useSubjectMaterials"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"
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

interface SubjectMaterialsTabProps {
  institutionId: string
  subjectId: string
  isTeacher: boolean
  isLoading?: boolean
}

export default function SubjectMaterialsTab({
  institutionId,
  subjectId,
  isTeacher,
  isLoading,
}: SubjectMaterialsTabProps) {
  const [openDialog, setOpenDialog] = useState(false)
  const [materialTitle, setMaterialTitle] = useState("")
  const [materialDescription, setMaterialDescription] = useState("")
  const [attachmentId, setAttachmentId] = useState("")

  const { data: materials, isLoading: isLoadingMaterials } =
    useSubjectMaterials(institutionId, subjectId)

  const createMaterialMutation = useCreateMaterial(institutionId, subjectId)

  const loading = isLoading || isLoadingMaterials

  function handleOpenDialog() {
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    if (createMaterialMutation.isPending) return
    setOpenDialog(false)
    setMaterialTitle("")
    setMaterialDescription("")
    setAttachmentId("")
  }

  function handleSubmitMaterial(e: React.FormEvent) {
    e.preventDefault()
    if (!materialTitle.trim()) return

    createMaterialMutation.mutate(
      {
        title: materialTitle,
        description: materialDescription,
        attachment_id: attachmentId || null,
      },
      {
        onSuccess() {
          handleCloseDialog()
        },
      }
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Materiais da disciplina</h2>
        {isTeacher && (
          <Button size="sm" variant="outline" onClick={handleOpenDialog}>
            Novo material
          </Button>
        )}
      </div>

      {loading && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material: any) => {
            const id = material.material_id ?? material.id
            const title =
              material.title ??
              material.name ??
              material.attachment?.filename ??
              "Material sem título"
            const description =
              material.description ??
              (material.attachment?.mime_type
                ? `Arquivo ${material.attachment.mime_type}`
                : "Material de apoio da disciplina.")
            const attachmentUrl = material.attachment?.url

            return (
              <Card key={id} className="flex h-full flex-col border-border/60">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">{title}</span>
                  </CardTitle>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0">
                  {attachmentUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={attachmentUrl} target="_blank" rel="noreferrer">
                        Abrir
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sem anexo
                    </span>
                  )}

                  {isTeacher && (
                    <Button size="icon" variant="ghost" disabled>
                      {/* futuramente: menu de ações (editar/excluir) */}
                      ···
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de criação de material */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo material</DialogTitle>
            <DialogDescription>
              Cadastre um novo material para os alunos desta disciplina.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitMaterial} className="space-y-3 py-2">
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

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Descrição
              </label>
              <Textarea
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                rows={3}
                placeholder="Descrição breve do material."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                ID do anexo (attachment_id)
              </label>
              <Input
                value={attachmentId}
                onChange={(e) => setAttachmentId(e.target.value)}
                placeholder="Cole aqui o attachment_id retornado pelo upload"
              />
              <p className="text-[11px] text-muted-foreground">
                Depois você pode integrar com o fluxo de upload de arquivos para
                preencher esse campo automaticamente.
              </p>
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
                disabled={createMaterialMutation.isPending}
              >
                {createMaterialMutation.isPending
                  ? "Salvando..."
                  : "Criar material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
