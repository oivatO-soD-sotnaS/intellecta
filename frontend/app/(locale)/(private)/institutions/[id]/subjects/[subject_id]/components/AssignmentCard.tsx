import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  onOpenDetails
}: AssignmentCardProps) {
  const title = assignment.title ?? assignment.name ?? "Atividade sem título"
  const description =
    assignment.description ??
    "Atividade avaliativa da disciplina. Detalhes serão exibidos ao abrir."
  const dueDate = assignment.due_date ?? assignment.deadline
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

        {dueDate && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarClock className="h-3 w-3" />
            <span>Entrega até:</span>
            <span className="font-medium">
              {new Date(dueDate).toLocaleString()}
            </span>
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
