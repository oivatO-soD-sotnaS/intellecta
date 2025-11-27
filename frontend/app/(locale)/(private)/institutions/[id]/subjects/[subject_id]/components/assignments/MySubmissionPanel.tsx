"use client"

import { useEffect, useState } from "react"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import type { SubmissionDTO } from "@/hooks/subjects/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload } from "lucide-react"
import { useSubmissionDetails } from "@/hooks/subjects/submissions/useSubmissionDetails"
import { useSubmitAssignment } from "@/hooks/subjects/submissions/useSubmitAssignment"
import { useUpdateSubmissionAttachment } from "@/hooks/subjects/submissions/useUpdateSubmissionAttachment"
import { useSubmissionCacheStore } from "@/hooks/subjects/submissions/useSubmissionCacheStore"
import { useFileUpload } from "@/hooks/use-file-upload"
import { FileUploadComponent } from "../../../../components/FileUploadComponent"

interface MySubmissionPanelProps {
  institutionId: string
  subjectId: string
  assignmentId: string
}

export default function MySubmissionPanel({
  institutionId,
  subjectId,
  assignmentId,
}: MySubmissionPanelProps) {
  const { data: currentUserData } = useCurrentUser()

  // 🔹 Integração com Zustand store
  const { getSubmissionId, setSubmissionId: setCachedSubmissionId } =
    useSubmissionCacheStore()

  // 🔹 Estado local do submissionId
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  // 🔹 Efeito para carregar submissionId do cache quando o usuário estiver disponível
  useEffect(() => {
    if (!currentUserData) return

    const cachedId = getSubmissionId({
      institutionId,
      subjectId,
      assignmentId,
      userId: currentUserData.user_id,
    })

    if (cachedId) {
      setSubmissionId(cachedId)
    }
  }, [currentUserData, getSubmissionId, institutionId, subjectId, assignmentId])

  const submitMutation = useSubmitAssignment()
  const updateAttachmentMutation = useUpdateSubmissionAttachment()

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

  const file = files[0] ?? null

  // 🔹 Hook para buscar detalhes da submissão
  const { data: mySubmission, isLoading: isLoadingDetails } =
    useSubmissionDetails({
      institutionId,
      subjectId,
      assignmentId,
      submissionId: submissionId ?? undefined,
      enabled: Boolean(submissionId),
    })

  const isPending =
    submitMutation.isPending || updateAttachmentMutation.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !currentUserData) return

    const currentFile = file

    const attachmentFile =
      currentFile instanceof File
        ? currentFile
        : "file" in currentFile && currentFile.file instanceof File
          ? currentFile.file
          : null

    if (!attachmentFile) {
      console.error("Arquivo inválido para envio de submissão")
      return
    }

    // 🔹 Chave para o cache
    const key = {
      institutionId,
      subjectId,
      assignmentId,
      userId: currentUserData.user_id,
    }

    // ➜ Ainda não tem submissão: cria e guarda o submission_id
    if (!mySubmission) {
      submitMutation.mutate(
        {
          institutionId,
          subjectId,
          assignmentId,
          attachment: attachmentFile,
        },
        {
          onSuccess: (createdSubmission: SubmissionDTO) => {
            setSubmissionId(createdSubmission.submission_id)
            setCachedSubmissionId(key, createdSubmission.submission_id)
            removeFile(currentFile.id)
          },
        }
      )
    } else {
      // ➜ Já tem submissão: atualiza o anexo
      updateAttachmentMutation.mutate(
        {
          institutionId,
          subjectId,
          assignmentId,
          submissionId: mySubmission.submission_id,
          attachment: attachmentFile,
        },
        {
          onSuccess: (updatedSubmission: SubmissionDTO) => {
            setSubmissionId(updatedSubmission.submission_id)
            setCachedSubmissionId(key, updatedSubmission.submission_id)
            removeFile(currentFile.id)
          },
        }
      )
    }
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Minha entrega</CardTitle>
        <p className="text-xs text-muted-foreground">
          Envie ou atualize o arquivo da sua resposta para esta atividade.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoadingDetails && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {!isLoadingDetails && !mySubmission && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Você ainda não enviou nenhuma entrega para esta atividade.</p>
            <p className="text-xs">
              Selecione o arquivo da sua resposta no campo abaixo e clique em{" "}
              <span className="font-semibold">Enviar entrega</span>.
            </p>
          </div>
        )}

        {!isLoadingDetails && mySubmission && (
          <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">Entrega enviada em:</span>
                  <span className="text-muted-foreground">
                    {new Date(mySubmission.submitted_at).toLocaleString()}
                  </span>
                </div>
              </div>
              {mySubmission.attachment?.url && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-[11px]"
                >
                  <a
                    href={mySubmission.attachment.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir anexo
                  </a>
                </Button>
              )}
            </div>

            <div className="grid gap-1 md:grid-cols-2">
              <div>
                <span className="font-medium text-foreground">
                  Conceito/nota:
                </span>{" "}
                <span className="text-muted-foreground">
                  {mySubmission.concept ?? "Ainda não avaliada"}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">Feedback:</span>{" "}
                <span className="text-muted-foreground line-clamp-2">
                  {mySubmission.feedback ?? "Ainda não há feedback."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Formulário para enviar/atualizar anexo */}
        {!isLoadingDetails && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="overflow-hidden">
              <FileUploadComponent
                label={
                  mySubmission
                    ? "Atualizar arquivo da entrega"
                    : "Arquivo da entrega"
                }
                maxSize={maxSize}
                file={file}
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

            <p className="text-[11px] text-muted-foreground">
              Envie um único arquivo com a sua resposta. Você poderá reenviar um
              novo arquivo caso precise atualizar a entrega.
            </p>

            <Button
              type="submit"
              size="sm"
              disabled={isPending || !file}
              className="flex items-center gap-2"
            >
              <Upload className="h-3 w-3" />
              {mySubmission ? "Atualizar entrega" : "Enviar entrega"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
