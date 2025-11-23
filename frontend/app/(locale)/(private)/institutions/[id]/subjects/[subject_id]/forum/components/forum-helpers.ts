// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/forum-helpers.ts

export const POST_PLACEHOLDERS = [
  "Aviso sobre prova de recuperação...",
  "Mudança de horário da aula...",
  "Orientações para o trabalho final...",
  "Lembrete de entrega de atividade...",
  "Atualização do cronograma da disciplina...",
]

export const SEARCH_PLACEHOLDERS = [
  "Buscar por 'prova'",
  "Encontrar 'trabalho final'",
  "Filtrar por 'seminário'",
  "Procurar avisos sobre 'nota'",
]

export function formatForumDate(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function getInitials(name?: string | null) {
  if (!name) return "??"
  const parts = name.split(" ").filter(Boolean)
  if (!parts.length) return "??"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}
