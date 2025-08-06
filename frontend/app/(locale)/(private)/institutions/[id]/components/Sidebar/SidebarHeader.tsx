"use client"

import { useParams } from "next/navigation"
import { useInstitution } from "@/hooks/institution/useInstitution"
import { Button } from "@heroui/button"
import { Menu } from "lucide-react"
import { useSidebarStore } from "@/store/sidebarStore"

export default function SidebarHeader() {
  const params = useParams()
  const institutionId = Array.isArray(params.id) ? params.id[0] : params.id

  if (!institutionId) return null

  const { data, isLoading } = useInstitution(institutionId)
  const { collapsed, toggle } = useSidebarStore()

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      {!collapsed && (
        <h1 className="text-lg font-semibold truncate">
          {isLoading ? "Carregando…" : data?.name}
        </h1>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <Menu size={20} />
      </Button>
    </div>
  )
}
