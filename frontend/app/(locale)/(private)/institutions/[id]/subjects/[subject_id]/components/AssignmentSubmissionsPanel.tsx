import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import { UserCircle2 } from "lucide-react"
import type { SubmissionDTO } from "@/hooks/subjects/types"
import { useEvaluateSubmission } from "@/hooks/subjects/submissions/useEvaluateSubmission"
import { useAssignmentSubmissions } from "@/hooks/subjects/submissions/useAssignmentSubmissions"

interface AssignmentSubmissionsPanelProps {
  institutionId: string
  subjectId: string
  assignmentId: string
}

export default function AssignmentSubmissionsPanel({
  institutionId,
  subjectId,
  assignmentId,
}: AssignmentSubmissionsPanelProps) {
  const { data: submissions, isLoading } = useAssignmentSubmissions({
    institutionId,
    subjectId,
    assignmentId,
  })

  const [openDialog, setOpenDialog] = useState(false)
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissionDTO | null>(null)
  const [concept, setConcept] = useState("")
  const [feedback, setFeedback] = useState("")

  const evaluateMutation = useEvaluateSubmission()

  function handleOpenEvaluation(submission: SubmissionDTO) {
    setCurrentSubmission(submission)
    setConcept(submission.concept ?? "")
    setFeedback(submission.feedback ?? "")
    setOpenDialog(true)
  }

  function handleSubmitEvaluation() {
    if (!currentSubmission) return

    evaluateMutation.mutate(
      {
        institutionId,
        subjectId,
        assignmentId,
        submissionId: currentSubmission.submission_id,
        concept,
        feedback,
      },
      {
        onSuccess() {
          setOpenDialog(false)
        },
      }
    )
  }

  return (
    <Card className="border-border/70">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          Entregas da atividade{" "}
          <span className="font-mono text-xs text-muted-foreground">
            ({assignmentId})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        )}

        {!isLoading && (!submissions || submissions.length === 0) && (
          <p className="text-sm text-muted-foreground">
            Nenhuma submissão foi feita para esta atividade ainda.
          </p>
        )}

        {!isLoading && submissions && submissions.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Conceito</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Anexo</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.submission_id}>
                    <TableCell className="min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {submission.user.full_name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {submission.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {submission.concept ?? (
                        <span className="text-muted-foreground/70">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-xs">
                      <span className="line-clamp-2">
                        {submission.feedback ?? (
                          <span className="text-muted-foreground/70">—</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      {submission.attachment?.url ? (
                        <Button asChild size="sm" variant="outline">
                          <a
                            href={submission.attachment.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground/70">
                          Sem anexo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleOpenEvaluation(submission)}
                      >
                        Avaliar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliar submissão</DialogTitle>
            <DialogDescription>
              Forneça o conceito e um feedback para o aluno. Essas informações
              ficarão visíveis para ele.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Conceito / Nota
              </label>
              <Input
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Ex.: 9.5, A, B+, etc."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                Feedback
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escreva um comentário construtivo para o aluno."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitEvaluation}
              disabled={evaluateMutation.isPending}
            >
              {evaluateMutation.isPending ? "Salvando..." : "Salvar avaliação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
