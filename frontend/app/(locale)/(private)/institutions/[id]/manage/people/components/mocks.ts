import type { InstitutionUser } from "./types"

export const MOCK_INSTITUTION_USERS: InstitutionUser[] = [
  {
    institution_user_id: "iu-001",
    institution_id: "inst-1",
    user_id: "u-001",
    role: "admin",
    created_at: "2024-03-01T10:00:00Z",
    user: {
      user_id: "u-001",
      full_name: "João da Silva",
      email: "joao@example.com",
      created_at: "2023-01-01T12:00:00Z",
      profile_picture: undefined,
    },
  },
  {
    institution_user_id: "iu-002",
    institution_id: "inst-1",
    user_id: "u-002",
    role: "teacher",
    created_at: "2024-03-02T09:00:00Z",
    user: {
      user_id: "u-002",
      full_name: "Maria Souza",
      email: "maria@example.com",
      created_at: "2023-02-10T09:00:00Z",
    },
  },
  {
    institution_user_id: "iu-003",
    institution_id: "inst-1",
    user_id: "u-003",
    role: "teacher",
    created_at: "2024-04-05T14:30:00Z",
    user: {
      user_id: "u-003",
      full_name: "Carlos Pereira",
      email: "carlos@example.com",
      created_at: "2023-03-20T11:00:00Z",
    },
  },
  {
    institution_user_id: "iu-004",
    institution_id: "inst-1",
    user_id: "u-004",
    role: "student",
    created_at: "2024-08-12T08:15:00Z",
    user: {
      user_id: "u-004",
      full_name: "Ana Costa",
      email: "ana@example.com",
      created_at: "2023-05-12T10:05:00Z",
    },
  },
  {
    institution_user_id: "iu-005",
    institution_id: "inst-1",
    user_id: "u-005",
    role: "student",
    created_at: "2024-08-13T12:45:00Z",
    user: {
      user_id: "u-005",
      full_name: "Bruno Almeida",
      email: "bruno@example.com",
      created_at: "2023-06-01T08:00:00Z",
    },
  },
]
