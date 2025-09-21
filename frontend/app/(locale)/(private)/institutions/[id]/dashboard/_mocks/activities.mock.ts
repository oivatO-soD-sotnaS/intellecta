export type ActivityKind = "atividade" | "material" | "forum"

export type RecentActivity = {
  id: string
  kind: ActivityKind
  title: string
  subject: string // ex: "Matemática Avançada"
  author: string // ex: "Dr. Carlos Mendes"
  dateLabel: string // ex: "Entrega em 25/06/2025", "Postado em 20/06/2025", "Postado há 2 horas"
  status?: "Pendente" | "Enviado" | "Novo" | "Discussão"
  highlighted?: boolean // uma faixa mais clara p/ destacar
}

export const activitiesMock: RecentActivity[] = [
  {
    id: "a1",
    kind: "atividade",
    title: "Lista de Exercícios 4",
    subject: "Matemática Avançada",
    author: "Dr. Carlos Mendes",
    dateLabel: "Entrega em 25/06/2025",
    status: "Pendente",
  },
  {
    id: "a2",
    kind: "atividade",
    title: "Projeto de Website",
    subject: "Programação Web",
    author: "Profa. Juliana Costa",
    dateLabel: "Entregue em 20/06/2025",
    status: "Enviado",
    highlighted: true,
  },
  {
    id: "a3",
    kind: "material",
    title: "Slides Aula 12 - Integrais Múltiplas",
    subject: "Matemática Avançada",
    author: "Dr. Carlos Mendes",
    dateLabel: "Postado em 20/06/2025",
    status: "Novo",
  },
  {
    id: "a4",
    kind: "forum",
    title: "Dúvida sobre Campo Magnético",
    subject: "Física III",
    author: "Dr. Roberto Almeida",
    dateLabel: "Postado há 2 horas",
    status: "Discussão",
  },
]
