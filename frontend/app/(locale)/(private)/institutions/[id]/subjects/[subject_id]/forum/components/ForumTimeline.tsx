// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumTimeline.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import { ForumMessageCard } from "./ForumMessageCard"
import { ForumMessageDTO, ForumMessagesPagingDTO } from "@/types/forum"

type ForumTimelineProps = {
  messages: ForumMessageDTO[]
  paging?: ForumMessagesPagingDTO
  canPost: boolean
  page: number
  setPage: (p: number) => void
  isFetching: boolean
  editingId: string | null
  editingContent: string
  setEditingContent: (value: string) => void
  onEditClick: (message: ForumMessageDTO) => void
  onEditCancel: () => void
  onEditSave: (message: ForumMessageDTO) => void
}

export function ForumTimeline({
  messages,
  paging,
  canPost,
  page,
  setPage,
  isFetching,
  editingId,
  editingContent,
  setEditingContent,
  onEditClick,
  onEditCancel,
  onEditSave,
}: ForumTimelineProps) {
  const hasMore =
    paging &&
    typeof paging.total_pages === "number" &&
    page < paging.total_pages

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-2 grid w-full grid-cols-2">
          <TabsTrigger value="all">Todos os avisos</TabsTrigger>
          <TabsTrigger value="recent">Mais recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {messages.map((message) => (
            <ForumMessageCard
              key={message.forum_messages_id}
              message={message}
              canPost={canPost}
              isEditing={editingId === message.forum_messages_id}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              onEditClick={() => onEditClick(message)}
              onEditCancel={onEditCancel}
              onEditSave={() => onEditSave(message)}
            />
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-3">
          {messages
            .slice()
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((message) => (
              <ForumMessageCard
                key={`${message.forum_messages_id}-recent`}
                message={message}
                canPost={canPost}
                isEditing={editingId === message.forum_messages_id}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                onEditClick={() => onEditClick(message)}
                onEditCancel={onEditCancel}
                onEditSave={() => onEditSave(message)}
              />
            ))}
        </TabsContent>
      </Tabs>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => setPage(page + 1)}
          >
            {isFetching ? "Carregando..." : "Carregar mais"}
          </Button>
        </div>
      )}
    </div>
  )
}
