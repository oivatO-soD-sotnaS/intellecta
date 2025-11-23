// app/(locale)/(private)/institutions/[id]/components/InstitutionSidebarContent.tsx
"use client"

import { SidebarProvider, SidebarContent } from "@/components/ui/sidebar"
import { useSidebarStore } from "@/store/sidebarStore"
import { makeNav } from "./sidebar/constants"
import { useActivePath } from "./sidebar/use-active-path"
import SidebarHeaderCard from "./sidebar/SidebarHeaderCard"
import Section from "./sidebar/Section"
import ListExpanded from "./sidebar/ListExpanded"
import ListCollapsed from "./sidebar/ListCollapsed"
import { useInstitution } from "../layout"
import { useClasses } from "@/hooks/classes/useClasses"
import { BookOpen } from "lucide-react"
import { Skeleton } from "@heroui/skeleton"

export default function InstitutionSidebarContent() {
  const { institution, me } = useInstitution()
  const {
    data, 
    isPending, 
  } = useClasses(institution.institution_id, {
    select: (data) => {
      return data.map(c => {
        return {
          label: c.name,
          icon: <BookOpen className="size-4" />,
          href: `/institutions/${institution.institution_id}/classes/${c.class_id}`,
        }
      })
    }
  })
  
  const { MENU, SETTINGS } = makeNav(institution.institution_id)
  
  const { isCollapsed } = useSidebarStore()
  const { isActive } = useActivePath()

  return (
    <SidebarProvider>
      <div className="flex h-full min-h-0 flex-col">
        <SidebarHeaderCard institution={institution} collapsed={isCollapsed} />

        <SidebarContent className="flex-1">
          {isCollapsed ? (
            <div className="flex h-full flex-col justify-start gap-6 py-2">
              <section aria-label="Menu">
                <ListCollapsed items={MENU} isActive={isActive} me={me} />
              </section>

              <section aria-label="Turmas">
                {isPending ? (
                  <Skeleton className="w-full h-6 rounded-lg"/>
                ) : (
                  <ListCollapsed items={data ?? []} isActive={isActive} me={me}/>
                )}
              </section>

              <section aria-label="Configurações" className="mt-auto pb-3">
                <ListCollapsed items={SETTINGS} isActive={isActive} me={me}/>
              </section>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <Section title="MENU">
                <ListExpanded items={MENU} isActive={isActive} me={me}/>
              </Section>

              <Section title="TURMAS">
                {isPending ? (
                  <Skeleton className="w-full h-6 rounded-lg"/>
                ) : (
                  <ListExpanded items={data ?? []} isActive={isActive} me={me}/>
                )}
              </Section>

              <Section title="CONFIGURAÇÕES">
                <ListExpanded items={SETTINGS} isActive={isActive} me={me}/>
              </Section>
            </div>
          )}
        </SidebarContent>
      </div>
    </SidebarProvider>
  )
}
