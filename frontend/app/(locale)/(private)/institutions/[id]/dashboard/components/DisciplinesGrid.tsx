// app/(locale)/(private)/institutions/[id]/dashboard/components/DisciplinesGrid.tsx

"use client";


import { AnimatePresence, motion } from "framer-motion";
import CourseCard from "../../components/CourseCard";
import { useInstitutionSubjectsMock } from "@/hooks/institution-page/useInstitutionCoursesMock";

type Props = {
  institutionId?: string;
  title?: string;
};

export default function DisciplinesGrid({ institutionId, title = "Suas Disciplinas" }: Props) {
  const { data, isLoading } = useInstitutionSubjectsMock(institutionId);

  return (
    <section className="w-full">
      <header className="mb-3 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      </header>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-zinc-200/70 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-20 w-full bg-zinc-200/60 dark:bg-zinc-700/40" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-4 w-1/2 rounded bg-zinc-200/70 dark:bg-zinc-700/50" />
                <div className="h-16 w-full rounded bg-zinc-200/60 dark:bg-zinc-700/40" />
                <div className="h-9 w-36 rounded-xl bg-zinc-200/70 dark:bg-zinc-700/50" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && (
        <>
          {(!data || data.length === 0) ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {data.map((s) => (
                  <CourseCard key={s.subject_id} subject={s} onOpen={() => { /* navegação */ }} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
      Nenhuma disciplina encontrada.
    </div>
  );
}
