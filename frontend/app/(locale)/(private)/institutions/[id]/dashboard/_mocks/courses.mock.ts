// app/(locale)/(private)/institutions/[id]/dashboard/_mocks/courses.mock.ts

import { SubjectDTO } from "@/types/subject";

export const subjectsMock: SubjectDTO[] = [
  {
    subject_id: "subj-001",
    institution_id: "inst-001",
    name: "Matemática Avançada",
    description:
      "Tópicos selecionados de cálculo, álgebra linear e otimização aplicados a problemas reais.",
    banner: { file_id: "f1", url: "https://images.unsplash.com/photo-1535930749574-1399327ce78f" },
    teacher: {
      full_name: "Dr. Carlos Mendes",
      email: "carlos.mendes@example.com",
      profile_picture: {
        file_id: "t1",
        url: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
      },
    },
  },
  {
    subject_id: "subj-002",
    institution_id: "inst-001",
    name: "Programação Web",
    description:
      "Fundamentos modernos de desenvolvimento web com foco em front-end e boas práticas.",
    banner: { file_id: "f2", url: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
    teacher: {
      full_name: "Profa. Juliana Costa",
      email: "juliana.costa@example.com",
      profile_picture: {
        file_id: "t2",
        url: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
      },
    },
  },
  {
    subject_id: "subj-003",
    institution_id: "inst-001",
    name: "Física III",
    description:
      "Ondas, eletromagnetismo e aplicações. Ênfase em resolução de problemas e experimentação.",
    banner: { file_id: "f3", url: "https://images.unsplash.com/photo-1517976487492-57688f1a1674" },
    teacher: {
      full_name: "Dr. Roberto Almeida",
      email: "roberto.almeida@example.com",
      profile_picture: {
        file_id: "t3",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      },
    },
  },
];
