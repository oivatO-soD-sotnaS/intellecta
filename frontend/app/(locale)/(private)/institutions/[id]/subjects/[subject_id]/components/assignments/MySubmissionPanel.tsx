"use client"

import { useMemo, useState } from "react"

import { useCurrentUser } from "@/hooks/auth/useCurrentUser"
import type { SubmissionDTO } from "@/hooks/subjects/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload } from "lucide-react"
import { useAssignmentSubmissions } from "@/hooks/subjects/submissions/useAssignmentSubmissions"
import { useSubmitAssignment } from "@/hooks/subjects/submissions/useSubmitAssignment"
import { useUpdateSubmissionAttachment } from "@/hooks/subjects/submissions/useUpdateSubmissionAttachment"

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

  const { data: submissions, isLoading } = useAssignmentSubmissions({
    institutionId,
    subjectId,
    assignmentId,
  })

  const submitMutation = useSubmitAssignment()
  const updateAttachmentMutation = useUpdateSubmissionAttachment()

  const [attachmentId, setAttachmentId] = useState("")

  const mySubmission: SubmissionDTO | null = useMemo(() => {
    if (!submissions || !currentUserData) return null
    return (
      submissions.find((s) => s.user_id === currentUserData.user_id) ?? null
    )
  }, [submissions, currentUserData])

  const isPending =
    submitMutation.isPending || updateAttachmentMutation.isPending

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attachmentId.trim()) return

    // Se ainda não tem submissão → cria
    if (!mySubmission) {
      submitMutation.mutate(
        {
          institutionId,
          subjectId,
          assignmentId,
          payload: {
            // seguindo o mesmo padrão do PATCH de attachment
            attachment_id: attachmentId,
          },
        },
        {
          onSuccess() {
            setAttachmentId("")
          },
        }
      )
    } else {
      // Se já tem → atualiza apenas o anexo
      updateAttachmentMutation.mutate(
        {
          institutionId,
          subjectId,
          assignmentId,
          submissionId: mySubmission.submission_id,
          attachmentId,
        },
        {
          onSuccess() {
            setAttachmentId("")
          },
        }
      )
    }
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Minha entrega{" "}
          <span className="font-mono text-xs text-muted-foreground">
            ({assignmentId})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {!isLoading && !mySubmission && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Você ainda não enviou nenhuma entrega para esta atividade.</p>
            <p className="text-xs">
              Use o campo abaixo para informar o <code>attachment_id</code> do
              arquivo que você enviou pelo sistema de upload.
            </p>
          </div>
        )}

        {!isLoading && mySubmission && (
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
        {!isLoading && (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                ID do anexo (attachment_id)
              </label>
              <Input
                value={attachmentId}
                onChange={(e) => setAttachmentId(e.target.value)}
                placeholder="Cole aqui o attachment_id gerado pelo upload"
              />
              <p className="text-[11px] text-muted-foreground">
                Em breve você pode integrar este campo com o componente de
                upload para que o ID seja preenchido automaticamente.
              </p>
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isPending || !attachmentId.trim()}
              className="flex items-center gap-2"
            >
              <Upload className="h-3 w-3" />
              {mySubmission ? "Atualizar anexo da entrega" : "Enviar entrega"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
