"use client"

import { useInstitutionCoursesMock } from "@/hooks/institution-page/useInstitutionCoursesMock"
import CourseCard from "../../components/CourseCard"

export default function DisciplinesGrid() {
  const { data } = useInstitutionCoursesMock()

  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold">Suas Disciplinas</h2>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((c) => (
          <CourseCard
            key={c.id}
            title={c.title}
            teacher={c.teacher}
            activities={c.activities}
            materials={c.materials}
            color={c.color}
          />
        ))}
      </div>
    </section>
  )
}
