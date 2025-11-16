// app/(locale)/(private)/institutions/[id]/classes/[classId]/_components/ClassHeader.tsx
"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@heroui/badge"

type Props = {
  institutionId: string
  classId: string
}

export function ClassHeader({ institutionId, classId }: Props) {
  return (
    <Card className="overflow-hidden border border-border/60 bg-gradient-to-br from-background via-background/80 to-background/40">
      <div className="relative h-28 w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#6366f1_0,_transparent_50%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)] opacity-70"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-border/60">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold leading-tight sm:text-xl">
              Turma selecionada
            </h1>
            <p className="text-xs text-muted-foreground">
              Instituição <span className="font-mono">{institutionId}</span> —
              Turma <span className="font-mono">{classId}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="flat" className="h-6 px-2 text-[10px]">
                ID da turma: {classId}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
