// app/(locale)/(private)/institutions/[id]/components/InstitutionSidebarContent.tsx
"use client"

import { useParams } from "next/navigation"
import { SidebarProvider, SidebarContent } from "@/components/ui/sidebar"
import { useSidebarStore } from "@/store/sidebarStore"
import { makeNav } from "./sidebar/constants"
import { useActivePath } from "./sidebar/use-active-path"
import SidebarHeaderCard from "./sidebar/SidebarHeaderCard"
import Section from "./sidebar/Section"
import ListExpanded from "./sidebar/ListExpanded"
import ListCollapsed from "./sidebar/ListCollapsed"

export default function InstitutionSidebarContent() {
  const { isCollapsed } = useSidebarStore()
  const { isActive } = useActivePath()

  const params = useParams<{ id: string }>()
  const institutionId = Array.isArray(params?.id) ? params.id[0] : params?.id

  if (!institutionId) return null

  const { MENU, CLASSES, SETTINGS } = makeNav(institutionId)

  return (
    <SidebarProvider>
      <div className="flex h-full min-h-0 flex-col">
        <SidebarHeaderCard collapsed={isCollapsed} />

        <SidebarContent className="flex-1">
          {isCollapsed ? (
            <div className="flex h-full flex-col justify-start gap-6 py-2">
              <section aria-label="Menu">
                <ListCollapsed items={MENU} isActive={isActive} />
              </section>

              <section aria-label="Turmas">
                <ListCollapsed items={CLASSES} isActive={isActive} />
              </section>

              <section aria-label="Configurações" className="mt-auto pb-3">
                <ListCollapsed items={SETTINGS} isActive={isActive} />
              </section>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <Section title="MENU">
                <ListExpanded items={MENU} isActive={isActive} />
              </Section>

              <Section title="TURMAS">
                <ListExpanded items={CLASSES} isActive={isActive} />
              </Section>

              <Section title="CONFIGURAÇÕES">
                <ListExpanded items={SETTINGS} isActive={isActive} />
              </Section>
            </div>
          )}
        </SidebarContent>
      </div>
    </SidebarProvider>
  )
}
