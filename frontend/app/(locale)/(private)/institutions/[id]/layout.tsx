// app/(locale)/(private)/institutions/[id]/layout.tsx
import Header from "../../components/Header"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import InstitutionSidebarContent from "./components/InstitutionSidebarContent"
import { Menu } from "lucide-react"

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
        <div className="flex gap-6">
          <Sidebar className="hidden md:flex md:flex-col w-[280px] shrink-0 border border-border rounded-xl bg-card pt-16">
            <InstitutionSidebarContent />
          </Sidebar>

          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
