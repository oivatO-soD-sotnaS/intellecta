// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumEmptyState.tsx

import { Megaphone } from "lucide-react"

export function ForumEmptyState({ canPost }: { canPost: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 bg-card/60 p-8 text-center text-sm">
      <Megaphone className="h-6 w-6 text-primary" />
      <p className="font-medium">
        {canPost
          ? "Nenhum aviso foi publicado ainda."
          : "Ainda não há avisos publicados no fórum."}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground">
        {canPost
          ? "Use o campo acima para criar o primeiro aviso para sua turma."
          : "Assim que o professor publicar um aviso, ele aparecerá aqui."}
      </p>
    </div>
  )
}
