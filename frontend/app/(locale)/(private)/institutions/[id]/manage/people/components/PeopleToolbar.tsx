// app/(locale)/(private)/institutions/[id]/manage/people/_components/PeopleToolbar.tsx
"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Search } from "lucide-react"

type RoleFilter = "all" | "admin" | "teacher" | "student"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  role: RoleFilter
  onRoleChange: (r: RoleFilter) => void
  totalFiltered: number
}

export default function PeopleToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  totalFiltered,
}: Props) {
  const [local, setLocal] = React.useState(search)

  React.useEffect(() => setLocal(search), [search])

  React.useEffect(() => {
    const id = setTimeout(() => onSearchChange(local), 300)
    return () => clearTimeout(id)
  }, [local, onSearchChange])

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="pl-8"
        />
      </div>

      <div className="flex items-center gap-3">
        <ToggleGroup
          type="single"
          value={role}
          onValueChange={(v) => onRoleChange((v as RoleFilter) || "all")}
          className="flex flex-wrap"
        >
          <ToggleGroupItem value="all">Todos</ToggleGroupItem>
          <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
          <ToggleGroupItem value="teacher">Professor</ToggleGroupItem>
          <ToggleGroupItem value="student">Aluno</ToggleGroupItem>
        </ToggleGroup>
        <span className="text-sm text-muted-foreground">({totalFiltered})</span>
      </div>
    </div>
  )
}
