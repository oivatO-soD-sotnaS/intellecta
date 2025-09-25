// app/(locale)/(private)/institutions/[id]/layout.tsx
// (SEM "use client" aqui)
import InstitutionSidebarContent from "./components/InstitutionSidebarContent";
import SidebarProviderClient from "./components/SidebarProviderClient";
import SidebarRailClient from "./components/SidebarRailClient";

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className=" px-3 sm:px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
          <SidebarProviderClient>
              <InstitutionSidebarContent />
          </SidebarProviderClient>

          {/* Conteúdo */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
