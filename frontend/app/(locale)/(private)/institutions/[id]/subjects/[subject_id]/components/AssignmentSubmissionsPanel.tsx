import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCircle2 } from "lucide-react"
import type { SubmissionDTO } from "@/hooks/subjects/types"
import { useAssignmentSubmissions } from "@/hooks/subjects/submissions/useAssignmentSubmissions"

interface AssignmentSubmissionsPanelProps {
  institutionId: string
  subjectId: string
  assignmentId: string
  onEvaluateSubmission?: (submission: SubmissionDTO) => void
}

export default function AssignmentSubmissionsPanel({
  institutionId,
  subjectId,
  assignmentId,
  onEvaluateSubmission,
}: AssignmentSubmissionsPanelProps) {
  const { data: submissions, isLoading } = useAssignmentSubmissions({
    institutionId,
    subjectId,
    assignmentId,
  })

  return (
    <>
      <div className="border-border/70">
        <div className="pb-3">
          <div className="text-sm">
            Entregas da atividade{" "}
            <span className="font-mono text-xs text-muted-foreground">
              ({assignmentId})
            </span>
          </div>
        </div>

        <div className="space-y-2">
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
                          variant="outline"
                          size="sm"
                          onClick={() => onEvaluateSubmission?.(submission)}
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
        </div>
      </div>
    </>
  )
}
