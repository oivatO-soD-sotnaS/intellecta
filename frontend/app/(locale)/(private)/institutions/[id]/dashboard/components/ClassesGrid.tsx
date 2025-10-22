"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { ClassDTO } from "@/types/class"
import CourseCard from "../../components/CourseCard"
import CreateClassButton from "../../components/classes/CreateClassButton"

// ⬇️ shadcn carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Props = {
  title?: string
  data?: ClassDTO[]
  isLoading?: boolean
  isError?: boolean
  onOpenClass?: (class_id: string) => void
  institutionId: string
}

export default function ClassesGrid({
  title = "Suas Turmas",
  data,
  isLoading,
  isError,
  onOpenClass,
  institutionId,
}: Props) {
  return (
    <section className="w-full">
      <header className="mb-3 flex items-end justify-between">
        <h2 className="flex items-center gap-4 text-lg font-semibold">
          <span>{title}</span>
          <CreateClassButton institutionId={institutionId} />
        </h2>
      </header>

      {isLoading ? (
        <SkeletonGrid />
      ) : isError ? (
        <div className="rounded-2xl border border-red-300/60 bg-red-50 p-4 text-red-700">
          Ocorreu um erro ao carregar suas turmas. Tente novamente.
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="popLayout">
          {/* Carrossel em loop */}
          <Carousel
            className="w-full"
            opts={{ loop: true, align: "start" }} // 👈 loop ligado
          >
            <CarouselContent className="-ml-3">
              {data.map((klass, i) => (
                <CarouselItem
                  key={klass.class_id}
                  // 1 por slide no sm, 2 no md, 3 no xl
                  className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 2xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                    whileHover={{ y: -2 }}
                  >
                    <CourseCard
                      klass={klass}
                      onOpen={() => onOpenClass?.(klass.class_id)}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controles do carrossel */}
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
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
