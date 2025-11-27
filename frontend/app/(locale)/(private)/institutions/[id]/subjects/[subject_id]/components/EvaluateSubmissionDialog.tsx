import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import type { SubmissionDTO } from "@/hooks/subjects/types"
import { useEvaluateSubmission } from "@/hooks/subjects/submissions/useEvaluateSubmission"

interface EvaluateSubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: SubmissionDTO | null
  institutionId: string
  subjectId: string
  assignmentId: string
}

export function EvaluateSubmissionDialog({
  open,
  onOpenChange,
  submission,
  institutionId,
  subjectId,
  assignmentId,
}: EvaluateSubmissionDialogProps) {
  const [concept, setConcept] = useState("")
  const [feedback, setFeedback] = useState("")

  const evaluateMutation = useEvaluateSubmission()

  // Atualiza os campos quando a submissão muda
  useEffect(() => {
    if (submission) {
      setConcept(submission.concept ?? "")
      setFeedback(submission.feedback ?? "")
    }
  }, [submission])

  function handleSubmitEvaluation() {
    if (!submission) return

    evaluateMutation.mutate(
      {
        institutionId,
        subjectId,
        assignmentId,
        submissionId: submission.submission_id,
        concept,
        feedback,
      },
      {
        onSuccess() {
          onOpenChange(false)
        },
      }
    )
  }

  if (!submission) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
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
            onClick={() => onOpenChange(false)}
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
  )
}
