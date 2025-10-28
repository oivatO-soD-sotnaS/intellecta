// app/(locale)/(private)/institutions/[id]/manage/people/components/mocks.ts
import type { Invitation } from "./types"

export const MOCK_INVITATIONS: Invitation[] = [
  {
    invitation_id: "inv-1",
    email: "user@example.com",
    role: "admin",
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    accepted_at: null,
    created_at: new Date().toISOString(),
    institution_id: "inst-1",
    invited_by: "usr-1",
    invited_by_user: {
      user_id: "usr-1",
      full_name: "João da Silva",
      email: "joao@example.com",
      created_at: "2023-01-01T12:00:00Z",
      changed_at: "2023-01-02T13:30:00Z",
      profile_picture: {
        file_id: "file-1",
        url: "https://picsum.photos/seed/joao/80",
        filename: "profile.jpg",
        mime_type: "image/jpeg",
        size: 102400,
        uploaded_at: "2023-01-01T12:00:00Z",
        file_type: "image",
      },
    },
    institution: {
      institution_id: "inst-1",
      name: "UFMG",
      email: "contato@ufmg.br",
      description: "Universidade pública brasileira sediada em Belo Horizonte",
    },
  },
  {
    invitation_id: "inv-2",
    email: "maria@example.com",
    role: "professor",
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    accepted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    institution_id: "inst-1",
    invited_by: "usr-2",
  },
  {
    invitation_id: "inv-3",
    email: "ana@example.com",
    role: "aluno",
    expires_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // expirado
    accepted_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    institution_id: "inst-1",
    invited_by: "usr-1",
  },
]
