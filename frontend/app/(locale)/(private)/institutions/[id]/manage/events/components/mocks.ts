import type { InstitutionalEvent } from "./types"

const iso = (d: Date) => d.toISOString()
const addDays = (d: Date, n: number) => {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + n)
  return nd
}

export const MOCK_INSTITUTIONAL_EVENTS = (
  institutionId: string
): InstitutionalEvent[] => {
  const now = new Date()
  return [
    {
      institutional_event_id: "ie-100",
      institution_id: institutionId,
      event_id: "e-100",
      title: "Reunião de Coordenação",
      description: "Alinhamento do semestre",
      event_date: iso(addDays(now, 1)),
      event_type: "reuniao",
    },
    {
      institutional_event_id: "ie-101",
      institution_id: institutionId,
      event_id: "e-101",
      title: "Feriado Municipal",
      description: "Ponto facultativo",
      event_date: iso(addDays(now, 3)),
      event_type: "feriado",
    },
    {
      institutional_event_id: "ie-102",
      institution_id: institutionId,
      event_id: "e-102",
      title: "Prova Integrada",
      description: "Avaliação institucional",
      event_date: iso(addDays(now, 7)),
      event_type: "prova",
    },
    {
      institutional_event_id: "ie-103",
      institution_id: institutionId,
      event_id: "e-103",
      title: "Semana Acadêmica",
      description: "Abertura do evento",
      event_date: iso(addDays(now, 10)),
      event_type: "aviso",
    },
  ]
}
