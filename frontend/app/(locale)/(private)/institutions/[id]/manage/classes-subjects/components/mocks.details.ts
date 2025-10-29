import type { Assignment, Material } from "./types"

export const MOCK_ASSIGNMENTS_BY_SUBJECT: Record<string, Assignment[]> = {
  "s-1": [
    {
      assignment_id: "a-101",
      title: "Lista 1: Lógica básica",
      description: "Estruturas de decisão e laços",
      deadline: new Date(Date.now() + 7 * 864e5).toISOString(),
      subject_id: "s-1",
      attachment: {
        file_id: "f-a1",
        url: "/files/lista1.pdf",
        filename: "lista1.pdf",
        mime_type: "application/pdf",
        size: 123456,
      },
    },
  ],
  "s-2": [],
  "s-3": [
    {
      assignment_id: "a-301",
      title: "Projeto SQL",
      description: "Modelagem e consultas",
      deadline: new Date(Date.now() + 10 * 864e5).toISOString(),
      subject_id: "s-3",
    },
  ],
}

export const MOCK_MATERIALS_BY_SUBJECT: Record<string, Material[]> = {
  "s-1": [
    {
      material_id: "m-100",
      title: "Slides – Introdução",
      created_at: new Date().toISOString(),
      subject_id: "s-1",
      file_id: "f-m1",
      file: {
        file_id: "f-m1",
        url: "/files/slides-introducao.pdf",
        filename: "slides-introducao.pdf",
        mime_type: "application/pdf",
        size: 210_000,
        uploaded_at: new Date().toISOString(),
      },
    },
  ],
  "s-2": [],
  "s-3": [],
}
