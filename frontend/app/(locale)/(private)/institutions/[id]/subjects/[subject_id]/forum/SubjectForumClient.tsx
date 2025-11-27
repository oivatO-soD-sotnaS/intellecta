// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/SubjectForumClient.tsx
"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

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
import { ForumMessageDTO } from "@/types/forum"
import { ForumEmptyState } from "./components/ForumEmptyState"
import { useUpdateForumMessage } from "@/hooks/forum/useUpdateForumMessage"
import { useInstitution } from "../../../layout"

// 🔹 hook de contexto da instituição, que expõe o `me.role`

type SubjectForumClientProps = {
  institutionId: string
  subjectId: string
  /**
   * Flag opcional para desabilitar posts globalmente.
   * Mesmo se for true, só "teacher" vai poder postar.
   */
  canPost?: boolean
}

export default function SubjectForumClient({
  institutionId,
  subjectId,
  canPost = true,
}: SubjectForumClientProps) {
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d")
  const [searchContent, setSearchContent] = useState<string | undefined>()
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<string>("")

  // 🔹 pega o role do usuário na instituição
  const { me } = useInstitution()
  const userRole = me?.role // "admin" | "teacher" | "student"

  // 🔹 apenas teacher pode postar no fórum da disciplina
  const canPostByRole = userRole === "teacher"
  const effectiveCanPost = canPost && canPostByRole

  // Debug
  console.log("SubjectForumClient props / role:", {
    institutionId,
    subjectId,
    canPostProp: canPost,
    userRole,
    effectiveCanPost,
  })

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
  const updateMessage = useUpdateForumMessage()

  const messages = messagesPage?.records ?? []
  const paging = messagesPage?.paging
  const isEmpty = !isLoading && messages.length === 0

  const handleComposerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!effectiveCanPost) return

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
            variant: "bordered",
            color: "success",
            description: "O aviso foi enviado para o fórum da disciplina.",
          })
        },
      }
    )
  }

  const handleSearchSubmit = (searchTerm: string) => {
    setSearchContent(searchTerm || undefined)
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
        institutionId,
        subjectId,
        forumMessageId: message.forum_messages_id,
        content: newContent,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditingContent("")
          addToast({
            title: "Mensagem atualizada",
            variant: "bordered",
            color: "success",
            description: "As alterações foram salvas com sucesso.",
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
              canPost={effectiveCanPost}
              period={period}
              setPeriod={setPeriod}
              onSubmit={handleSearchSubmit}
            />

            {/* 🔹 Apenas teacher vê o formulário de nova mensagem */}
            {effectiveCanPost && (
              <form onSubmit={handleComposerSubmit} className="space-y-3">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escreva uma mensagem para o fórum da disciplina..."
                  className="min-h-[100px] resize-none"
                  disabled={createMessage.isPending}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputValue.trim() || createMessage.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {createMessage.isPending ? "Publicando..." : "Publicar"}
                  </Button>
                </div>
              </form>
            )}

            <Separator />

            {isLoading ? (
              <ForumSkeletonList />
            ) : isError ? (
              <ForumErrorState onRetry={refetch} />
            ) : isEmpty ? (
              <ForumEmptyState canPost={effectiveCanPost} />
            ) : (
              <ForumTimeline
                messages={messages}
                paging={paging}
                canPost={effectiveCanPost}
                page={page}
                setPage={setPage}
                isFetching={isFetching}
                editingId={editingId}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                onEditClick={handleEditClick}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                userRole={userRole}
              />
            )}
          </div>

          <ForumSidebar canPost={effectiveCanPost} />
        </div>
      </div>
    </div>
  )
}
