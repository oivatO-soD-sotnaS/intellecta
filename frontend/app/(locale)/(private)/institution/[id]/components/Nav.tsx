// app/(locale)/(private)/institution/[id]/components/Nav.tsx
"use client"

import { Tabs,   } from "@heroui/tabs"
import type { InstitutionTab } from "@/store/institutionStore"

interface NavProps {
  activeTab: InstitutionTab
  onChange: (tab: InstitutionTab) => void
}

export default function Nav({ activeTab, onChange }: NavProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onChange(v as InstitutionTab)}
      className="w-full"
    >
      <TabsList className="border-b border-gray-200 bg-white">
        <TabsTrigger value="overview" className="px-4 py-2 text-sm font-medium">
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="courses" className="px-4 py-2 text-sm font-medium">
          Disciplinas
        </TabsTrigger>
        <TabsTrigger value="members" className="px-4 py-2 text-sm font-medium">
          Membros
        </TabsTrigger>
        <TabsTrigger value="settings" className="px-4 py-2 text-sm font-medium">
          Configurações
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
