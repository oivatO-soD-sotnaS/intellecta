// app/(...)/components/mocks.ts
import type { ClassSummary, Subject, ClassSubject } from "./types"

export const MOCK_CLASSES: ClassSummary[] = [
  { class_id: "class-a", name: "3º Ano - Informática" },
  { class_id: "class-b", name: "4º Ano - Informática" },
]

export const MOCK_SUBJECTS: Subject[] = [
  {
    subject_id: "s-1",
    name: "Programação I",
    description: "Fundamentos de lógica e algoritmos",
    institution_id: "inst-1",
    teacher_id: "u-200",
    teacher: {
      user_id: "u-200",
      full_name: "Maria Souza",
      email: "maria@example.com",
    },
    profile_picture: "/subjects/code.png",
    banner: "/subjects/banner-code.jpg",
  },
  {
    subject_id: "s-2",
    name: "Redes de Computadores",
    description: "Camadas, protocolos e endereçamento",
    institution_id: "inst-1",
    teacher_id: "u-201",
    teacher: {
      user_id: "u-201",
      full_name: "Carlos Pereira",
      email: "carlos@example.com",
    },
    profile_picture: "/subjects/network.png",
    banner: "/subjects/banner-network.jpg",
  },
  {
    subject_id: "s-3",
    name: "Banco de Dados",
    description: "Modelo relacional e SQL",
    institution_id: "inst-1",
    teacher_id: "u-200",
    teacher: {
      user_id: "u-200",
      full_name: "Maria Souza",
      email: "maria@example.com",
    },
    profile_picture: "/subjects/db.png",
    banner: "/subjects/banner-db.jpg",
  },
]

export const MOCK_CLASS_SUBJECTS_BY_CLASS: Record<string, ClassSubject[]> = {
  "class-a": [
    {
      class_subjects_id: "cs-1",
      class_id: "class-a",
      subject: MOCK_SUBJECTS[0],
    },
    {
      class_subjects_id: "cs-2",
      class_id: "class-a",
      subject: MOCK_SUBJECTS[2],
    },
  ],
  "class-b": [
    {
      class_subjects_id: "cs-3",
      class_id: "class-b",
      subject: MOCK_SUBJECTS[1],
    },
  ],
}
