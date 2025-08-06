// app/(locale)/(private)/institution/[id]/layout.tsx
import Sidebar from "./components/Sidebar/Sidebar"

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
