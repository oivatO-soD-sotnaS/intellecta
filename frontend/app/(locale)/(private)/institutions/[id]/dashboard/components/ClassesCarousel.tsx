"use client"

import * as React from "react"
import { motion } from "framer-motion"
import type { ClassDTO } from "@/types/class"

import CourseCard from "../../components/CourseCard"
import CreateClassButton from "../../components/classes/CreateClassButton"
import ClassEditClassModal from "../../components/classes/ClassEditClassModal"
import { useClasses } from "@/hooks/classes/useClasses"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Props = {
  title?: string
  /** Se o pai já buscou, pode injetar por props. Caso contrário, buscamos aqui. */
  data?: ClassDTO[]
  isLoading?: boolean
  isError?: boolean

  onOpenClass?: (class_id: string) => void
  institutionId: string

  /** controla o menu (três pontinhos) nos cards */
  isInstitutionAdmin?: boolean
}

export default function ClassesCarousel({
  title = "Suas Turmas",
  data: dataFromProps,
  isLoading: loadingFromProps,
  isError: errorFromProps,
  onOpenClass,
  institutionId,
  isInstitutionAdmin = true, // <- ajuste para sua flag real, se houver
}: Props) {
  // Se não vier por props, buscamos aqui:
  const { data, isLoading, isError, refetch } = useClasses(institutionId)
  const list = dataFromProps ?? data ?? []
  const loading = loadingFromProps ?? isLoading
  const error = errorFromProps ?? isError

  // Estado do modal de edição
  const [editOpen, setEditOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ClassDTO | null>(null)

  const handleEditRequest = (klass: ClassDTO) => {
    setEditing(klass)
    setEditOpen(true)
  }

  return (
    <section className="w-full">
      <header className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isInstitutionAdmin && (
          <CreateClassButton
            institutionId={institutionId}
            onCreated={() => refetch()}
          />
        )}
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-300/60 bg-red-50 p-4 text-red-700">
          Ocorreu um erro ao carregar suas turmas. Tente novamente.
        </div>
      ) : loading ? (
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
      ) : list.length === 0 ? (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhuma turma encontrada.
        </div>
      ) : (
        <>
          <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-3">
              {list.map((klass, i) => (
                <CarouselItem
                  key={klass.class_id}
                  className="basis-full pl-3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 2xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.04 * i }}
                  >
                    <CourseCard
                      klass={klass}
                      institutionId={institutionId}
                      canManage={isInstitutionAdmin}
                      onDeleted={() => refetch()}
                      onEditClass={handleEditRequest}
                      onOpen={() => onOpenClass?.(klass.class_id)}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>

          {/* Modal de Edição – precisa estar no mesmo componente que controla o estado */}
          <ClassEditClassModal
            open={editOpen}
            onOpenChange={setEditOpen}
            institutionId={institutionId}
            klass={editing}
            onSaved={() => refetch()}
          />
        </>
      )}
    </section>
  )
}
