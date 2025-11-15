// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumMessageCard.tsx

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatForumDate, getInitials } from "./forum-helpers"
import { Avatar } from "@heroui/avatar"
import { ForumMessageDTO } from "@/types/forum"

type ForumMessageCardProps = {
  message: ForumMessageDTO
  canPost: boolean
  isEditing: boolean
  editingContent: string
  setEditingContent: (value: string) => void
  onEditClick: () => void
  onEditCancel: () => void
  onEditSave: () => void
}

/**
 * Card com visual inspirado no TweetCard do MagicUI.
 * (Aqui usamos apenas o layout, sem fetch externo.)
 */
export function ForumMessageCard({
  message,
  canPost,
  isEditing,
  editingContent,
  setEditingContent,
  onEditClick,
  onEditCancel,
  onEditSave,
}: ForumMessageCardProps) {
  const author = message.sent_by
  const createdLabel = formatForumDate(message.created_at)
  const edited = message.changed_at && message.changed_at !== message.created_at

  return (
    <article
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border/70 bg-card/80 p-4 text-sm shadow-sm backdrop-blur-md transition-all",
        "hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-border/60">
            {/* {author?.profile_picture?.url && (
              <AvatarImage
                src={author.profile_picture.url}
                alt={author.full_name ?? "Avatar"}
              />
            )} */}
            {/* <AvatarFallback>
              {getInitials(author?.full_name ?? "Professor")}
            </AvatarFallback> */}
          </Avatar>

          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="font-medium">
                {author?.full_name ?? "Professor da disciplina"}
              </span>
              <span className="text-muted-foreground/70">·</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                Aviso da disciplina
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
              <span>{createdLabel}</span>
              {edited && (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span>editado</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="min-h-[80px] w-full resize-y rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none ring-0 focus-visible:border-primary/70 focus-visible:ring-1 focus-visible:ring-primary/50"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEditCancel}
              >
                Cancelar
              </Button>
              <Button type="button" size="sm" onClick={onEditSave}>
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Mensagem do professor para esta disciplina.</span>

        {canPost && !isEditing && (
          <button
            type="button"
            onClick={onEditClick}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            Editar
          </button>
        )}
      </div>
    </article>
  )
}
