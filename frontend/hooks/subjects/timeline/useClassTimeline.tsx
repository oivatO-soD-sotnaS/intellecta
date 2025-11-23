// src/hooks/classes/useClassTimeline.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { ClassDetails, ClassSubject, ClassTimelineItem } from "./types"
import { ClassUserRow } from "@/hooks/classes/useClassUsers"
import { SubjectEvent } from "../events/types"



export function useClassTimeline(institutionId: string, classId?: string) {
  return useQuery<ClassTimelineItem[], Error>({
    enabled: Boolean(institutionId && classId),
    queryKey: ["class-timeline", institutionId, classId],
    retry: false,
    queryFn: async () => {
      if (!institutionId || !classId) {
        return []
      }

      // 1) Buscar turma, usuários e disciplinas em paralelo
      const classUrl = `/api/institutions/${institutionId}/classes/${classId}`
      const usersUrl = `/api/institutions/${institutionId}/classes/${classId}/users`
      const subjectsUrl = `/api/institutions/${institutionId}/classes/${classId}/subjects`

      const [classRes, usersRes, subjectsRes] = await Promise.all([
        fetch(classUrl, { method: "GET" }),
        fetch(usersUrl, { method: "GET" }),
        fetch(subjectsUrl, { method: "GET" }),
      ])

      if (!classRes.ok) {
        const errorText = await classRes.text().catch(() => "")
        throw new Error(
          errorText ||
            `Erro ao carregar dados da turma (status ${classRes.status})`
        )
      }

      // 404 em users/subjects = tratamos como vazio
      const users: ClassUserRow[] =
        usersRes.status === 404
          ? []
          : ((await usersRes.json()) as ClassUserRow[])

      const subjects: ClassSubject[] =
        subjectsRes.status === 404
          ? []
          : ((await subjectsRes.json()) as ClassSubject[])

      const classData = (await classRes.json()) as ClassDetails

      const timeline: ClassTimelineItem[] = []

      // 2) Evento: criação da turma
      if (classData.created_at) {
        timeline.push({
          id: `class-created-${classData.class_id}`,
          type: "class_created",
          date: classData.created_at,
          title: `Turma "${classData.name}" criada`,
          description: classData.description,
          meta: {},
        })
      }

      // 3) Eventos: pessoas que entraram na turma
      users.forEach((cu) => {
        if (!cu.joined_at) return

        timeline.push({
          id: `user-joined-${cu.class_users_id}`,
          type: "user_joined",
          date: cu.joined_at,
          title: `${cu.user.full_name} entrou na turma`,
          description: cu.user.email,
          meta: {
            user: cu.user,
          },
        })
      })

      // 4) Eventos: disciplinas criadas na turma
      subjects.forEach((subject) => {
        const createdAt =
          (subject as any).created_at ?? (subject as any).createdAt

        if (!createdAt) return

        timeline.push({
          id: `subject-created-${subject.subject_id}`,
          type: "subject_created",
          date: createdAt,
          title: `Disciplina "${subject.name}" criada`,
          description: subject.description,
          meta: {
            subject,
          },
        })
      })

      // 5) Eventos: eventos das disciplinas
      //    Para cada disciplina, buscar /events e adicionar na timeline
      const eventsBySubject: SubjectEvent[][] = await Promise.all(
        subjects.map(async (subject) => {
          const url = `/api/institutions/${institutionId}/subjects/${subject.subject_id}/events`
          const res = await fetch(url, { method: "GET" })

          if (res.status === 404) {
            return []
          }

          if (!res.ok) {
            // não quebra a timeline inteira se 1 subject der erro
            console.error(
              "[useClassTimeline] Erro ao carregar eventos da disciplina",
              subject.subject_id,
              res.status
            )
            return []
          }

          const events = (await res.json()) as SubjectEvent[]
          return events
        })
      )

      // Flatten nos eventos
      subjects.forEach((subject, idx) => {
        const events = eventsBySubject[idx] || []

        events.forEach((event) => {
          const eventDate = event.starts_at || event.created_at
          if (!eventDate) return

          timeline.push({
            id: `subject-event-${event.subject_event_id}`,
            type: "subject_event",
            date: eventDate,
            title: event.title || "Evento da disciplina",
            description: event.description,
            meta: {
              subject,
              event,
            },
          })
        })
      })

      // 6) Ordenar por data (mais recente primeiro)
      const toTime = (iso?: string) => (iso ? new Date(iso).getTime() : 0)

      timeline.sort((a, b) => toTime(b.date) - toTime(a.date))

      return timeline
    },
  })
}
