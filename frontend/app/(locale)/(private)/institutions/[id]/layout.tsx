// app/(locale)/(private)/institution/[id]/layout.tsx
import Sidebar from "./components/Sidebar/Sidebar"

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" w-full h-screen ">
      {/* Sidebar fixa à esquerda, acima de todo o conteúdo */}
      {/* <aside className="fixed top-0 left-0 h-full w-64 bg-white z-10">
        <Sidebar />
      </aside> */}

      {/* Área principal full width */}
      {children}
    </div>
  )
}
