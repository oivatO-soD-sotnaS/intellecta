// app/(locale)/(private)/institutions/[id]/classes/[classId]/_components/ClassTabs.tsx
"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Activity, LayoutList } from "lucide-react"
import { motion } from "framer-motion"

type Props = {
  value: "overview" | "subjects" | "people" | "timeline"
  onValueChange: (
    value: "overview" | "subjects" | "people" | "timeline"
  ) => void
}

export function ClassTabs({ value, onValueChange }: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) =>
        onValueChange(v as "overview" | "subjects" | "people" | "timeline")
      }
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabItem
          id="overview"
          icon={<LayoutList className="h-4 w-4" />}
          label="Visão geral"
          isActive={value === "overview"}
        />
        <TabItem
          id="subjects"
          icon={<BookOpen className="h-4 w-4" />}
          label="Disciplinas"
          isActive={value === "subjects"}
        />
        <TabItem
          id="people"
          icon={<Users className="h-4 w-4" />}
          label="Pessoas"
          isActive={value === "people"}
        />
        <TabItem
          id="timeline"
          icon={<Activity className="h-4 w-4" />}
          label="Timeline"
          isActive={value === "timeline"}
        />
      </TabsList>
    </Tabs>
  )
}

type TabItemProps = {
  id: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function TabItem({ id, icon, label, isActive }: TabItemProps) {
  return (
    <TabsTrigger
      value={id}
      className="relative flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm"
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <motion.span
          layoutId="class-tabs-pill"
          className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-primary/10"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </TabsTrigger>
  )
}
