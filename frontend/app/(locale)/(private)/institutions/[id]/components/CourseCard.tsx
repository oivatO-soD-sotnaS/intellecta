import { Card } from "@/components/ui/card"
 //import { Progress } from "@/components/ui/progress" se não existir, use um <div className="h-2 rounded bg-muted"><div className="h-2 bg-primary w-[...]"/></div>

type Props = {
  title: string
  teacher: string
  activities: number
  materials: number
  color?: string
}

export default function CourseCard({
  title,
  teacher,
  activities,
  materials,
  color = "from-indigo-500 to-blue-500",
}: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-sm transition-shadow">
      <div className={`h-20 bg-gradient-to-tr ${color}`} />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{teacher}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{activities} atividades</span>
          <span>{materials} materiais</span>
        </div>
        <div className="pt-2">
          {/* substitua por seu Progress se já existir */}
          <div className="h-2 bg-muted rounded">
            <div
              className="h-2 bg-primary rounded"
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">
            Progresso
          </p>
        </div>
      </div>
    </Card>
  )
}
