import type { ClassSummary, InstitutionUser, ClassUser } from "./types"

export const MOCK_CLASSES: ClassSummary[] = [
  { class_id: "class-a", name: "3º Ano - Informática" },
  { class_id: "class-b", name: "4º Ano - Informática" },
]

export const MOCK_INSTITUTION_USERS: InstitutionUser[] = [
  {
    institution_user_id: "iu-1",
    institution_id: "inst-1",
    user_id: "u-1",
    role: "admin",
    created_at: "2024-01-01T12:00:00Z",
    user: {
      user_id: "u-1",
      full_name: "João da Silva",
      email: "joao@example.com",
      profile_picture: {
        file_id: "f1",
        url: "https://storage.example.com/files/profile.jpg",
        filename: "profile.jpg",
        mime_type: "image/jpeg",
        size: 102400,
      },
    },
  },
  {
    institution_user_id: "iu-2",
    institution_id: "inst-1",
    user_id: "u-2",
    role: "professor",
    created_at: "2024-02-01T12:00:00Z",
    user: {
      user_id: "u-2",
      full_name: "Maria Souza",
      email: "maria@example.com",
    },
  },
  {
    institution_user_id: "iu-3",
    institution_id: "inst-1",
    user_id: "u-3",
    role: "aluno",
    created_at: "2024-03-01T12:00:00Z",
    user: { user_id: "u-3", full_name: "Ana Lima", email: "ana@example.com" },
  },
  {
    institution_user_id: "iu-4",
    institution_id: "inst-1",
    user_id: "u-4",
    role: "aluno",
    created_at: "2024-04-01T12:00:00Z",
    user: {
      user_id: "u-4",
      full_name: "Carlos Pereira",
      email: "carlos@example.com",
    },
  },
  {
    institution_user_id: "iu-5",
    institution_id: "inst-1",
    user_id: "u-5",
    role: "professor",
    created_at: "2024-05-01T12:00:00Z",
    user: {
      user_id: "u-5",
      full_name: "Beatriz Nogueira",
      email: "bia@example.com",
    },
  },
  {
    institution_user_id: "iu-6",
    institution_id: "inst-1",
    user_id: "u-6",
    role: "aluno",
    created_at: "2024-06-01T12:00:00Z",
    user: {
      user_id: "u-6",
      full_name: "Diego Ramos",
      email: "diego@example.com",
    },
  },
]

// roster inicial
export const MOCK_CLASS_USERS_BY_CLASS: Record<string, ClassUser[]> = {
  "class-a": [
    {
      class_users_id: "cu-1",
      joined_at: "2025-01-10T09:00:00Z",
      class_id: "class-a",
      user_id: "u-2",
      role: "professor",
      user: {
        user_id: "u-2",
        full_name: "Maria Souza",
        email: "maria@example.com",
      },
    },
    {
      class_users_id: "cu-2",
      joined_at: "2025-01-12T09:00:00Z",
      class_id: "class-a",
      user_id: "u-3",
      role: "aluno",
      user: { user_id: "u-3", full_name: "Ana Lima", email: "ana@example.com" },
    },
  ],
  "class-b": [
    {
      class_users_id: "cu-3",
      joined_at: "2025-02-01T09:00:00Z",
      class_id: "class-b",
      user_id: "u-5",
      role: "professor",
      user: {
        user_id: "u-5",
        full_name: "Beatriz Nogueira",
        email: "bia@example.com",
      },
    },
  ],
}
