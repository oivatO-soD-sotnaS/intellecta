// app/(locale)/(private)/institutions/[id]/components/classes/ClassesCarousel.tsx
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useClasses } from "@/hooks/classes/useClasses"
import { CreateClassButton } from "../../components/classes/CreateClassButton"
import CourseCard from "../CourseCard"

type Props = {
  institutionId: string
  isInstitutionAdmin?: boolean
  title?: string
  className?: string
  onOpenClass?: (classId: string) => void
}

export default function ClassesCarousel({
  institutionId,
  isInstitutionAdmin = false,
  title = "Suas Turmas",
  className,
  onOpenClass,
}: Props) {
  const { data, isLoading, isError, refetch } = useClasses(institutionId)

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {isInstitutionAdmin && (
          <CreateClassButton
            institutionId={institutionId}
            onCreated={() => refetch()}
          />
        )}
      </div>

      {isLoading && (
        <div className="py-8 text-sm text-foreground-500">Carregando…</div>
      )}
      {!isLoading && isError && (
        <div className="py-8 text-sm text-foreground-500">
          Não foi possível carregar as turmas.
        </div>
      )}
      {!isLoading && !isError && (data?.length ?? 0) === 0 && (
        <div className="py-8 text-sm text-foreground-500">
          Nenhuma turma por enquanto.
        </div>
      )}

      {!isLoading && !isError && (data?.length ?? 0) > 0 && (
        <Carousel
          className="w-full"
          opts={{ loop: true, align: "start" }}
        >
          <CarouselContent className="-ml-3">
            {data!.map((klass, i) => (
              <CarouselItem
                key={klass.class_id}
                className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 2xl:basis-1/4"
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
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </section>
  )
}
