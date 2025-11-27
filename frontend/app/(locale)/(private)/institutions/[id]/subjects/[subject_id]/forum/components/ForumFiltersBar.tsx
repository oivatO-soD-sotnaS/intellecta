// app/(locale)/(private)/institutions/[institution_id]/subjects/[subject_id]/forum/_components/ForumFiltersBar.tsx

import { useState, FormEvent } from "react"
import { Info, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { POST_PLACEHOLDERS, SEARCH_PLACEHOLDERS } from "./forum-helpers"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

type ForumFiltersBarProps = {
  canPost: boolean
  period: "7d" | "30d" | "all"
  setPeriod: (p: "7d" | "30d" | "all") => void
  onSubmit: (searchTerm: string) => void 
}

export function ForumFiltersBar({
  canPost,
  period,
  setPeriod,
  onSubmit,
}: ForumFiltersBarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const placeholders = canPost ? POST_PLACEHOLDERS : SEARCH_PLACEHOLDERS

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const term = searchTerm.trim()
    onSubmit(term)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/80 p-3 shadow-sm backdrop-blur-md sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          {canPost ? (
            <span>
              Você está publicando avisos como{" "}
              <span className="font-medium">professor(a)</span>.
            </span>
          ) : (
            <span>
              Este fórum é somente para{" "}
              <span className="font-medium">avisos do professor</span>. Use a
              busca para encontrar mensagens anteriores.
            </span>
          )}
        </div>

        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as typeof period)}
        >
          <SelectTrigger className="h-8 w-[160px] border-muted-foreground/30 text-xs">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleInputChange}
        onSubmit={handleFormSubmit}
      />

      {!canPost && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Search className="h-3 w-3" />
          <span>Use palavras-chave para encontrar avisos antigos.</span>
        </div>
      )}
    </div>
  )
}
