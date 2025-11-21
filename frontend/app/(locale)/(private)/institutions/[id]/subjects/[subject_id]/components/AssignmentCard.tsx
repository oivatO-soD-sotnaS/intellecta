import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, ChevronRight, DownloadIcon } from "lucide-react"

interface AssignmentCardProps {
  assignment: any
  isSelected?: boolean
  onSelect?: () => void
  canManage?: boolean
  onOpenDetails?: () => void
}

export default function AssignmentCard({
  assignment,
  isSelected,
  onSelect,
  canManage,
  onOpenDetails,
}: AssignmentCardProps) {
  const title = assignment.title ?? assignment.name ?? "Atividade sem título"
  const description =
    assignment.description ??
    "Atividade avaliativa da disciplina. Detalhes serão exibidos ao abrir."

  const dueDate = assignment.due_date ?? assignment.deadline
  const formattedDueDate =
    dueDate &&
    new Date(dueDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

  let deadlineClasses =
    "mt-2 flex items-center gap-2 rounded-md px-2 py-1 text-[11px] ring-1"

  if (dueDate) {
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    if (diffDays >= 7) {
      deadlineClasses += " bg-emerald-50 text-emerald-900 ring-emerald-200"
    } else if (diffDays >= 4 && diffDays <= 6) {
      deadlineClasses += " bg-amber-50 text-amber-900 ring-amber-200"
    } else {
      deadlineClasses += " bg-red-50 text-red-900 ring-red-200"
    }
  }

  const concept = assignment.concept
  const hasAttachment = !!assignment.attachment?.url

  return (
    <Card
      className={`flex h-full flex-col border-border/60 transition hover:border-primary/70 ${
        isSelected ? "border-primary/80 shadow-md" : ""
      }`}
    >
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-sm font-semibold">
            {title}
          </CardTitle>
          {concept && (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold uppercase tracking-wide text-emerald-800"
            >
              Avaliada
            </Badge>
          )}
        </div>
        
        {formattedDueDate && (
          <div className={deadlineClasses}>
            <CalendarClock className="h-3 w-3" />
            <span className="font-semibold uppercase tracking-wide">
              Entrega até:
            </span>
            <span className="font-medium">{formattedDueDate}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-auto space-y-3 pt-0">
        <p className="line-clamp-3 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            className="justify-between cursor-pointer"
            onClick={onSelect}
          >
            {isSelected ? "Ocultar entregas" : "Ver Entregas"}
            <ChevronRight className="h-3 w-3" />
          </Button>

          {canManage && onOpenDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenDetails}
              className="cursor-pointer"
            >
              Ver Detalhes
            </Button>
          )}
        </div>

        {hasAttachment && (
          <Button size="icon" variant="ghost" asChild>
            <a
              href={assignment.attachment!.url}
              target="_blank"
              rel="noopener noreferrer"
              download={assignment.attachment!.filename}
            >
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
