// app/(locale)/(private)/institution/[id]/layout.tsx
import Sidebar from "./components/Sidebar/Sidebar"

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fixa à esquerda */}
      <aside className="fixed top-0 left-0 h-full w-64">
        <Sidebar />
      </aside>

      {/* Conteúdo principal com margem para a sidebar */}
      <main className="flex-1 mx-auto overflow-auto p-6">{children}</main>
    </div>
  )
}
