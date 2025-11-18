// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/SubjectForumClient.tsx
"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"


import { ForumHeader } from "./components/ForumHeader"
import { ForumFiltersBar } from "./components/ForumFiltersBar"
import { ForumTimeline } from "./components/ForumTimeline"
import { ForumSkeletonList } from "./components/ForumSkeletonList"
import { ForumErrorState } from "./components/ForumErrorState"
import { ForumSidebar } from "./components/ForumSidebar"
import { addToast } from "@heroui/toast"
import { useForumMessages } from "@/hooks/forum/useForumMessages"
import { useForumMessagesCount } from "@/hooks/forum/useForumMessagesCount"
import { useCreateForumMessage } from "@/hooks/forum/useCreateForumMessage"
import { useUpdateForumMessage } from "@/hooks/forum/useUpdateForumMessage"
import { ForumMessageDTO } from "@/types/forum"
import { ForumEmptyState } from "./components/ForumEmptyState"

type SubjectForumClientProps = {
  institutionId: string
  subjectId: string
  /**
   * Define se o usuário pode postar no fórum.
   * (Somente professor deve ter canPost = true.)
   */
  canPost?: boolean
}

export default function SubjectForumClient({
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

  const messages = messagesPage?.records ?? []
  const paging = messagesPage?.paging
  const isEmpty = !isLoading && messages.length === 0

  const handleComposerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canPost) return

    const content = inputValue.trim()
    if (!content) return

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
        <ForumHeader totalCount={totalCount} isFetching={isFetching} />

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
