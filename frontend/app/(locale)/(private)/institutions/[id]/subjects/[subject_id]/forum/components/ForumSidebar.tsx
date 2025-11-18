// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumSidebar.tsx

import { Separator } from "@/components/ui/separator"

export function ForumSidebar({ canPost }: { canPost: boolean }) {
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-md">
        <h2 className="mb-1 text-sm font-semibold">Sobre este fórum</h2>
        <p className="text-xs text-muted-foreground">
          Este espaço é usado para avisos oficiais relacionados à disciplina. Os
          alunos podem ler e buscar mensagens anteriores para se manterem
          atualizados.
        </p>
        <Separator className="my-3" />
        <p className="text-[11px] text-muted-foreground">
          <span className="font-medium">Regras básicas:</span>
          <br />
          • Apenas professores podem publicar mensagens.
          <br />
          • As mensagens podem ser editadas por tempo limitado.
          <br />• Use o fórum como canal oficial, complementando o conteúdo das
          aulas.
        </p>
      </div>

      <div className="rounded-xl border bg-card/80 p-4 text-xs shadow-sm backdrop-blur-md">
        <h3 className="mb-1 text-sm font-semibold">Dicas para os alunos</h3>
        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
          <li>Confira o fórum antes de provas e entregas.</li>
          <li>Use a busca para encontrar avisos antigos por palavra-chave.</li>
          <li>Atente-se às datas e horários informados nas mensagens.</li>
        </ul>
        {!canPost && (
          <p className="mt-3 text-[11px] text-muted-foreground/80">
            Dúvidas sobre os avisos podem ser esclarecidas diretamente com o
            professor pelos canais indicados pela instituição.
          </p>
        )}
      </div>
    </aside>
  )
}
