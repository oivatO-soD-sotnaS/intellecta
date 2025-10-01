"use client"

import { AnimatePresence, motion } from "framer-motion"
import type { ClassDTO } from "@/types/class"
import CourseCard from "../../components/CourseCard"

type Props = {
  title?: string
  data?: ClassDTO[]
  isLoading?: boolean
  isError?: boolean
  onOpenClass?: (class_id: string) => void
}

export default function ClassesGrid({
  title = "Suas Turmas",
  data,
  isLoading,
  isError,
  onOpenClass,
}: Props) {
  if (isError) {
    return (
      <section className="w-full">
        <header className="mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
        </header>
        <div className="rounded-2xl border border-red-300/60 bg-red-50 p-4 text-red-700">
          Ocorreu um erro ao carregar suas turmas. Tente novamente.
        </div>
      </section>
    )
  }

  return (
    <section className="w-full">
      <header className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </header>

      {isLoading ? (
        <SkeletonGrid />
      ) : !data || data.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {data.map((klass) => (
              <CourseCard
                key={klass.class_id}
                klass={klass}
                onOpen={() => onOpenClass?.(klass.class_id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="h-20 w-full bg-muted" />
          <div className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="h-5 w-2/3 rounded bg-muted" />
            </div>
            <div className="h-16 w-full rounded bg-muted" />
            <div className="h-9 w-36 rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
      Nenhuma turma encontrada.
    </div>
  )
}
