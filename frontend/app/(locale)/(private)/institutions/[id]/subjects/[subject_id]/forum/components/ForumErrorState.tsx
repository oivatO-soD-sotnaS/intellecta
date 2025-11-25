// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumErrorState.tsx

import { Button } from "@/components/ui/button"

export function ForumErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center text-sm">
      <p className="font-medium text-destructive">
        Não foi possível carregar as mensagens do fórum.
      </p>
      <p className="max-w-sm text-xs text-destructive/80">
        Verifique sua conexão ou tente novamente em alguns instantes.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}
