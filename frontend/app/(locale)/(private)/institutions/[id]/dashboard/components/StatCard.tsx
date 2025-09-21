import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type Props = {
  icon: LucideIcon
  value: number | string
  label: string
  iconBg?: string 
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  iconBg = "bg-violet-100 text-violet-600",
}: Props) {
  return (
    <Card className="flex items-center gap-4 p-5 shadow-none border border-border/70">
      <div className={`grid size-10 place-items-center rounded-xl ${iconBg}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xl font-semibold leading-none">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}
