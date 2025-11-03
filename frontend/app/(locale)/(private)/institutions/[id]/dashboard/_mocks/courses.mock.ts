// courses.mock.ts
// Mock de classes, fiel ao contrato de "Classes".

import { ClassDTO } from "@/types/subjects"

export const classesMock: ClassDTO[] = [
  {
    class_id: "class-001",
    institution_id: "inst-001",
    name: "3º Ano - Matemática A",
    description:
      "Turma focada em cálculo diferencial, revisão de funções e preparação para olimpíadas.",
    banner: {
      file_id: "f1",
      url: "https://images.unsplash.com/photo-1535930749574-1399327ce78f",
      mime_type: "image/jpeg",
    },
    profile_picture: {
      file_id: "p1",
      url: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      mime_type: "image/jpeg",
    },
  },
  {
    class_id: "class-002",
    institution_id: "inst-001",
    name: "Programação Web — 2025/2",
    description:
      "HTML, CSS, TypeScript e frameworks. Projeto final em equipe com apresentação.",
    banner: {
      file_id: "f2",
      url: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
      mime_type: "image/jpeg",
    },
    profile_picture: {
      file_id: "p2",
      url: "https://images.unsplash.com/photo-1542744095-291d1f67b221",
      mime_type: "image/jpeg",
    },
  },
  {
    class_id: "class-003",
    institution_id: "inst-001",
    name: "Física III — Eletromagnetismo",
    description:
      "Campos elétricos e magnéticos, ondas eletromagnéticas e aplicações práticas.",
    banner: {
      file_id: "f3",
      url: "https://images.unsplash.com/photo-1517976487492-57688f1a1674",
      mime_type: "image/jpeg",
    },
    profile_picture: {
      file_id: "p3",
      url: "https://images.unsplash.com/photo-1581091215367-59ab6b243fc0",
      mime_type: "image/jpeg",
    },
  },
]
