import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, ChevronRight } from "lucide-react"

interface AssignmentCardProps {
  assignment: any
  isSelected?: boolean
  onSelect?: () => void
}

export default function AssignmentCard({
  assignment,
  isSelected,
  onSelect,
}: AssignmentCardProps) {
  const title = assignment.title ?? assignment.name ?? "Atividade sem título"
  const description =
    assignment.description ??
    "Atividade avaliativa da disciplina. Detalhes serão exibidos ao abrir."
  const dueDate = assignment.due_date ?? assignment.deadline
  const concept = assignment.concept // se algum endpoint já trouxer isso

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

        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className="w-full justify-between text-xs"
          onClick={onSelect}
        >
          {isSelected ? "Ocultar entregas" : "Ver detalhes & entregas"}
          <ChevronRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  )
}
