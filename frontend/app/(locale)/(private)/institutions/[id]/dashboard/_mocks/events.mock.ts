export type CalendarEvent = {
  id: string
  date: string 
  type: "Atividade" | "Prova" | "Aula"
  title: string
  course?: string
}

export const eventsMock: CalendarEvent[] = [
  {
    id: "e1",
    date: "2025-06-28",
    type: "Atividade",
    title: "Entrega do Trabalho Final",
    course: "Matemática Avançada",
  },
  {
    id: "e2",
    date: "2025-06-30",
    type: "Prova",
    title: "Prova Bimestral",
    course: "Física III",
  },
  {
    id: "e3",
    date: "2025-06-26",
    type: "Aula",
    title: "Aula de Revisão",
    course: "Programação Web",
  },
]
