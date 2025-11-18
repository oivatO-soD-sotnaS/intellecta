// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/SubjectForumClient.tsx
"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"

import { addToast } from "@heroui/toast"
import { useForumMessages } from "@/hooks/forum/useForumMessages"
import { useForumMessagesCount } from "@/hooks/forum/useForumMessagesCount"
import { useCreateForumMessage } from "@/hooks/forum/useCreateForumMessage"
import { useUpdateForumMessage } from "@/hooks/forum/useUpdateForumMessage"
import { ForumMessageDTO } from "@/types/forum"
import { ForumFiltersBar } from "../ForumFiltersBar"
import { ForumHeader } from "../ForumHeader"
import { ForumSkeletonList } from "../ForumSkeletonList"
import { ForumErrorState } from "../ForumErrorState"
import { ForumEmptyState } from "../ForumEmptyState"
import { ForumTimeline } from "../ForumTimeline"
import { ForumSidebar } from "../ForumSidebar"

type SubjectForumClientProps = {
  institutionId: string
  subjectId: string
  /**
   * Define se o usuário pode postar no fórum.
   * (Somente professor deve ter canPost = true.)
   */
  canPost?: boolean
}

// 🔹 Mensagens de exemplo (mock) para modo demonstração
const MOCK_FORUM_MESSAGES: ForumMessageDTO[] = [
  {
    forum_messages_id: "mock-forum-message-1",
    content:
      "Bem-vindos à disciplina! Nesta semana vamos revisar funções afim e quadrática. Leiam o material ‘Aula 1 - Introdução às Funções’ antes da próxima aula.",
    created_at: "2025-11-17T09:30:00Z",
    changed_at: "2025-11-17T09:30:00Z",
    subject_id: "mock-subject-id",
    sent_by: {
      user_id: "mock-teacher-1",
      full_name: "Prof. Ana Carvalho",
      email: "ana.carvalho@example.com",
      created_at: "2024-02-01T12:00:00Z",
      changed_at: "2024-06-10T08:30:00Z",
      profile_picture: {
        file_id: "mock-file-ana",
        url: "https://picsum.photos/seed/prof-ana/80/80",
        filename: "prof-ana.jpg",
        mime_type: "image/jpeg",
        size: 10240,
        uploaded_at: "2024-02-01T12:00:00Z",
        file_type: "image",
      },
    },
  },
  {
    forum_messages_id: "mock-forum-message-2",
    content:
      "Lembrando que a primeira lista de exercícios (Lista 1 - Funções) deve ser entregue até domingo, às 23h59, pelo sistema. Usem o espaço de dúvidas da disciplina se precisarem de ajuda.",
    created_at: "2025-11-18T14:15:00Z",
    changed_at: "2025-11-18T14:15:00Z",
    subject_id: "mock-subject-id",
    sent_by: {
      user_id: "mock-teacher-1",
      full_name: "Prof. Ana Carvalho",
      email: "ana.carvalho@example.com",
      created_at: "2024-02-01T12:00:00Z",
      changed_at: "2024-06-10T08:30:00Z",
      profile_picture: {
        file_id: "mock-file-ana",
        url: "https://picsum.photos/seed/prof-ana/80/80",
        filename: "prof-ana.jpg",
        mime_type: "image/jpeg",
        size: 10240,
        uploaded_at: "2024-02-01T12:00:00Z",
        file_type: "image",
      },
    },
  },
  {
    forum_messages_id: "mock-forum-message-3",
    content:
      "Amanhã teremos uma aula extra de revisão para quem ainda está com dificuldade em identificar coeficientes e interpretar o gráfico das funções. A participação é opcional, mas altamente recomendada.",
    created_at: "2025-11-19T18:00:00Z",
    changed_at: "2025-11-19T18:00:00Z",
    subject_id: "mock-subject-id",
    sent_by: {
      user_id: "mock-teacher-1",
      full_name: "Prof. Ana Carvalho",
      email: "ana.carvalho@example.com",
      created_at: "2024-02-01T12:00:00Z",
      changed_at: "2024-06-10T08:30:00Z",
      profile_picture: {
        file_id: "mock-file-ana",
        url: "https://picsum.photos/seed/prof-ana/80/80",
        filename: "prof-ana.jpg",
        mime_type: "image/jpeg",
        size: 10240,
        uploaded_at: "2024-02-01T12:00:00Z",
        file_type: "image",
      },
    },
  },
  {
    forum_messages_id: "mock-forum-message-4",
    content:
      "Postei no campo de materiais um vídeo curto com uma revisão de funções afim e quadrática. Assistam antes de começar a próxima lista.",
    created_at: "2025-11-20T10:45:00Z",
    changed_at: "2025-11-20T11:10:00Z", // editado
    subject_id: "mock-subject-id",
    sent_by: {
      user_id: "mock-teacher-1",
      full_name: "Prof. Ana Carvalho",
      email: "ana.carvalho@example.com",
      created_at: "2024-02-01T12:00:00Z",
      changed_at: "2024-06-10T08:30:00Z",
      profile_picture: {
        file_id: "mock-file-ana",
        url: "https://picsum.photos/seed/prof-ana/80/80",
        filename: "prof-ana.jpg",
        mime_type: "image/jpeg",
        size: 10240,
        uploaded_at: "2024-02-01T12:00:00Z",
        file_type: "image",
      },
    },
  },
]

const MOCK_FORUM_PAGING = {
  page: 1,
  total_pages: 1,
  total_records: MOCK_FORUM_MESSAGES.length,
}

export default function SubjectForumClientMock({
  institutionId,
  subjectId,
  canPost = false,
}: SubjectForumClientProps) {
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d")
  const [searchContent, setSearchContent] = useState<string | undefined>()
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")

  const dateFilters = useMemo(() => {
    if (period === "all") return {}
    const now = new Date()
    const from = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (period === "7d" ? 7 : 30)
    )
    return {
      created_at_from: from.toISOString().slice(0, 10),
      created_at_to: now.toISOString().slice(0, 10),
    }
  }, [period])

  const {
    data: messagesPage,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useForumMessages(institutionId, subjectId, {
    page,
    limit: 20,
    content: searchContent,
    ...dateFilters,
  })

  const { data: totalCount = 0 } = useForumMessagesCount(
    institutionId,
    subjectId,
    {
      content: searchContent,
      ...dateFilters,
    }
  )

  const createMessage = useCreateForumMessage(institutionId, subjectId)
  const updateMessage = useUpdateForumMessage(institutionId, subjectId)

  const hasRealRecords =
    !!messagesPage &&
    Array.isArray(messagesPage.records) &&
    messagesPage.records.length > 0

  const isUsingMock = !isLoading && !isError && !hasRealRecords

  const messages =
    (isUsingMock ? MOCK_FORUM_MESSAGES : messagesPage?.records) ?? []
  const paging = isUsingMock ? MOCK_FORUM_PAGING : messagesPage?.paging
  const isEmpty =
    !isLoading && !isError && !isUsingMock && messages.length === 0
  const effectiveTotalCount = isUsingMock ? messages.length : totalCount

  const handleComposerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canPost) return

    const content = inputValue.trim()
    if (!content) return

    if (isUsingMock) {
      // Modo demonstração: não envia para o backend
      addToast({
        title: "Modo demonstração",
        description:
          "As mensagens de exemplo servem apenas para visualizar o fórum. No backend ainda não há dados reais.",
        color: "warning",
      })
      setInputValue("")
      return
    }

    createMessage.mutate(
      { content },
      {
        onSuccess: () => {
          setInputValue("")
          setPage(1)
          addToast({
            title: "Mensagem publicada",
            description: "O aviso foi enviado para o fórum da disciplina.",
          })
        },
        onError: (error) => {
          addToast({
            title: "Erro ao publicar",
            description:
              error.message ?? "Tente novamente em alguns instantes.",
            color: "danger",
          })
        },
      }
    )
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (canPost) {
      // professor: input funciona como composer
      return handleComposerSubmit(e)
    }

    const term = inputValue.trim()
    setSearchContent(term || undefined)
    setPage(1)
  }

  const handleEditClick = (message: ForumMessageDTO) => {
    setEditingId(message.forum_messages_id)
    setEditingContent(message.content)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingContent("")
  }

  const handleEditSave = (message: ForumMessageDTO) => {
    const newContent = editingContent.trim()
    if (!newContent) return

    if (isUsingMock) {
      addToast({
        title: "Modo demonstração",
        description: "Não é possível editar mensagens de exemplo.",
        color: "warning",
      })
      return
    }

    updateMessage.mutate(
      {
        forumMessageId: message.forum_messages_id,
        content: newContent,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditingContent("")
          addToast({
            title: "Mensagem atualizada",
            description: "As alterações foram salvas com sucesso.",
          })
        },
        onError: (error) => {
          addToast({
            title: "Não foi possível editar",
            description:
              error.message ??
              "Talvez o tempo máximo de edição já tenha sido excedido.",
            color: "danger",
          })
        },
      }
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <ForumHeader totalCount={effectiveTotalCount} isFetching={isFetching} />

        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
          <div className="space-y-4">
            <ForumFiltersBar
              canPost={canPost}
              period={period}
              setPeriod={setPeriod}
              onSubmit={handleSearchSubmit}
            />

            <Separator />


            {isLoading ? (
              <ForumSkeletonList />
            ) : isError ? (
              <ForumErrorState onRetry={refetch} />
            ) : isEmpty ? (
              <ForumEmptyState canPost={canPost} />
            ) : (
              <ForumTimeline
                messages={messages}
                paging={paging}
                canPost={canPost}
                page={page}
                setPage={setPage}
                isFetching={isFetching}
                editingId={editingId}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                onEditClick={handleEditClick}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
              />
            )}
          </div>

          <ForumSidebar canPost={canPost} />
        </div>
      </div>
    </div>
  )
}
